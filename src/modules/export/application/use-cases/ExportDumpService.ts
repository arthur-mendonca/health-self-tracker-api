import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { DAILY_RECORD_REPOSITORY } from "../../../daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecordRepositoryPort } from "../../../daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecord } from "../../../daily-record/domain/entities/DailyRecord.ts";
import { formatDateOnly, parseDateOnly, todayDateOnlyInSaoPaulo } from "../../../../shared/utils/date.ts";
import type {
  ExportDump,
  ExportDumpQuery,
  ExportDumpUseCase,
} from "../ports/in/ExportDumpUseCase.ts";

@Injectable()
export class ExportDumpService implements ExportDumpUseCase {
  constructor(
    @Inject(DAILY_RECORD_REPOSITORY)
    private readonly dailyRecordRepository: DailyRecordRepositoryPort,
  ) {}

  async execute(query: ExportDumpQuery = {}): Promise<ExportDump> {
    const period = parseExportPeriod(query);
    const records = period.startDate || period.endDate
      ? await this.dailyRecordRepository.findByDateRange(period.startDate, period.endDate)
      : await this.dailyRecordRepository.findAll();

    return {
      generatedAt: new Date().toISOString(),
      period: {
        startDate: period.startDate ? formatDateOnly(period.startDate) : undefined,
        endDate: period.endDate ? formatDateOnly(period.endDate) : undefined,
      },
      records: records.map(toDumpRecord),
    };
  }

  async executeCsv(query: ExportDumpQuery = {}): Promise<string> {
    const dump = await this.execute(query);
    const headers = [
      "id",
      "date",
      "metrics",
      "structuredNotes",
      "tags",
      "substances",
      "activities",
      "createdAt",
      "updatedAt",
    ];

    const rows = dump.records.map((record) => {
      const dumpRecord = record as DumpRecord;
      return [
        dumpRecord.id,
        dumpRecord.date,
        toJsonCell(dumpRecord.metrics),
        toJsonCell(dumpRecord.structuredNotes),
        toJsonCell(dumpRecord.tags),
        toJsonCell(dumpRecord.substances),
        toJsonCell(dumpRecord.activities),
        dumpRecord.createdAt ?? "",
        dumpRecord.updatedAt ?? "",
      ];
    });

    return [headers, ...rows].map(toCsvRow).join("\n") + "\n";
  }

  async executeTxt(query: ExportDumpQuery = {}): Promise<string> {
    const dump = await this.execute(query);
    return dumpToText(dump);
  }

  async executePdf(query: ExportDumpQuery = {}): Promise<Uint8Array> {
    const text = await this.executeTxt(query);
    return textToPdf(text);
  }
}

type DumpRecord = ReturnType<typeof toDumpRecord>;

type ExportPeriod = {
  startDate?: Date;
  endDate?: Date;
};

function parseExportPeriod(query: ExportDumpQuery): ExportPeriod {
  if (query.days !== undefined && (query.startDate || query.endDate)) {
    throw new Error("days cannot be combined with startDate or endDate.");
  }

  if (query.days !== undefined) {
    if (!/^\d+$/.test(query.days)) {
      throw new Error("days must be a positive integer.");
    }

    const days = Number(query.days);

    if (!Number.isSafeInteger(days) || days < 1) {
      throw new Error("days must be a positive integer.");
    }

    const endDate = todayDateOnlyInSaoPaulo();
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - days + 1);

    return { startDate, endDate };
  }

  const startDate = query.startDate ? parseDateOnly(query.startDate) : undefined;
  const endDate = query.endDate ? parseDateOnly(query.endDate) : undefined;

  if (startDate && endDate && startDate > endDate) {
    throw new Error("startDate cannot be after endDate.");
  }

  return { startDate, endDate };
}

function toDumpRecord(record: DailyRecord) {
  return {
    id: record.id,
    date: formatDateOnly(record.date),
    metrics: record.metrics,
    structuredNotes: record.structuredNotes,
    tags: record.tags.map((tag) => ({
      name: tag.name,
      category: tag.category,
    })),
    substances: record.substances.map((log) => ({
      name: log.substance.name,
      type: log.substance.type,
      defaultDose: log.substance.defaultDose,
      exactDose: log.exactDose,
      notes: log.notes,
      effectDropTime: log.effectDropTime,
      experiencedCrash: log.experiencedCrash,
    })),
    activities: record.activities.map((log) => ({
      name: log.activity.name,
      notes: log.notes,
    })),
    createdAt: record.createdAt?.toISOString(),
    updatedAt: record.updatedAt?.toISOString(),
  };
}

function toJsonCell(value: unknown): string {
  return value == null ? "" : JSON.stringify(value);
}

function toCsvRow(values: unknown[]): string {
  return values.map(toCsvCell).join(",");
}

function toCsvCell(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function dumpToText(dump: ExportDump): string {
  const lines = [
    "Health Self Tracker Export",
    `Generated at: ${dump.generatedAt}`,
    `Period: ${formatPeriod(dump.period)}`,
    `Records: ${dump.records.length}`,
    "",
  ];

  if (dump.records.length === 0) {
    lines.push("No records found for this period.");
    return lines.join("\n") + "\n";
  }

  for (const record of dump.records as DumpRecord[]) {
    lines.push(`Date: ${record.date}`);
    lines.push(`ID: ${record.id}`);
    lines.push(`Metrics: ${toPrettyJson(record.metrics)}`);
    lines.push(`Structured notes: ${toPrettyJson(record.structuredNotes)}`);
    lines.push(`Tags: ${record.tags.map((tag) => `${tag.name} (${tag.category})`).join(", ") || "none"}`);
    lines.push(
      `Substances: ${record.substances.map((log) =>
        [
          log.name,
          log.type,
          log.exactDose,
          log.defaultDose ? `default ${log.defaultDose}` : null,
          log.effectDropTime ? `drop ${log.effectDropTime}` : null,
          log.experiencedCrash ? "crash" : null,
          log.notes ? `notes: ${log.notes}` : null,
        ].filter(Boolean).join(" | ")
      ).join("; ") || "none"}`
    );
    lines.push(`Activities: ${record.activities.map((log) => log.notes ? `${log.name} (${log.notes})` : log.name).join(", ") || "none"}`);
    lines.push(`Created at: ${record.createdAt ?? ""}`);
    lines.push(`Updated at: ${record.updatedAt ?? ""}`);
    lines.push("");
  }

  return lines.join("\n");
}

function formatPeriod(period: ExportDump["period"]): string {
  if (period.startDate && period.endDate) {
    return `${period.startDate} to ${period.endDate}`;
  }

  if (period.startDate) {
    return `from ${period.startDate}`;
  }

  if (period.endDate) {
    return `until ${period.endDate}`;
  }

  return "all records";
}

function toPrettyJson(value: unknown): string {
  return value == null ? "none" : JSON.stringify(value);
}

function textToPdf(text: string): Uint8Array {
  const lines = text
    .split("\n")
    .flatMap((line) => wrapPdfLine(line, 95));
  const pages = chunk(lines, 48);
  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");

  for (const pageLines of pages.length ? pages : [[]]) {
    const pageObjectId = objects.length + 1;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    contentObjectIds.push(contentObjectId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${2 + (pages.length || 1) * 2 + 1} 0 R >> >> /Contents ${contentObjectId} 0 R >>`);
    objects.push(pdfStreamForLines(pageLines));
  }

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index++) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

function pdfStreamForLines(lines: string[]): string {
  const commands = lines.map((line, index) => `BT /F1 10 Tf 40 ${752 - index * 15} Td (${escapePdfText(line)}) Tj ET`).join("\n");
  return `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`;
}

function escapePdfText(value: string): string {
  return value
    .replace(/[^\x20-\x7E]/g, "?")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function wrapPdfLine(line: string, maxLength: number): string[] {
  if (line.length <= maxLength) {
    return [line];
  }

  const wrapped: string[] = [];
  let remaining = line;

  while (remaining.length > maxLength) {
    let splitAt = remaining.lastIndexOf(" ", maxLength);
    splitAt = splitAt > 0 ? splitAt : maxLength;
    wrapped.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  wrapped.push(remaining);
  return wrapped;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

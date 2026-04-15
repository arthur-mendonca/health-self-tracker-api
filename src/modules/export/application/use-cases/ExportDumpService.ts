import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import {
  DAILY_RECORD_REPOSITORY
} from "../../../daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecordRepositoryPort } from "../../../daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecord } from "../../../daily-record/domain/entities/DailyRecord.ts";
import { formatDateOnly } from "../../../../shared/utils/date.ts";
import type { ExportDump, ExportDumpUseCase } from "../ports/in/ExportDumpUseCase.ts";

@Injectable()
export class ExportDumpService implements ExportDumpUseCase {
  constructor(
    @Inject(DAILY_RECORD_REPOSITORY)
    private readonly dailyRecordRepository: DailyRecordRepositoryPort
  ) {}

  async execute(): Promise<ExportDump> {
    const records = await this.dailyRecordRepository.findAll();

    return {
      generatedAt: new Date().toISOString(),
      records: records.map(toDumpRecord)
    };
  }

  async executeCsv(): Promise<string> {
    const dump = await this.execute();
    const headers = [
      "id",
      "date",
      "metrics",
      "structuredNotes",
      "tags",
      "substances",
      "activities",
      "createdAt",
      "updatedAt"
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
        dumpRecord.updatedAt ?? ""
      ];
    });

    return [headers, ...rows].map(toCsvRow).join("\n") + "\n";
  }
}

type DumpRecord = ReturnType<typeof toDumpRecord>;

function toDumpRecord(record: DailyRecord) {
  return {
    id: record.id,
    date: formatDateOnly(record.date),
    metrics: record.metrics,
    structuredNotes: record.structuredNotes,
    tags: record.tags.map((tag) => ({
      name: tag.name,
      category: tag.category
    })),
    substances: record.substances.map((log) => ({
      name: log.substance.name,
      type: log.substance.type,
      defaultDose: log.substance.defaultDose,
      exactDose: log.exactDose,
      notes: log.notes,
      effectDropTime: log.effectDropTime,
      experiencedCrash: log.experiencedCrash
    })),
    activities: record.activities.map((log) => ({
      name: log.activity.name,
      notes: log.notes
    })),
    createdAt: record.createdAt?.toISOString(),
    updatedAt: record.updatedAt?.toISOString()
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
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

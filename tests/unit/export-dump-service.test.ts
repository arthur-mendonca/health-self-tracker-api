import assert from "node:assert/strict";

import { ExportDumpService } from "../../src/modules/export/application/use-cases/ExportDumpService.ts";
import type { DailyRecordRepositoryPort } from "../../src/modules/daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import { DailyRecord } from "../../src/modules/daily-record/domain/entities/DailyRecord.ts";

Deno.test("ExportDumpService filters records by explicit date range", async () => {
  const repository = new FakeDailyRecordRepository();
  const service = new ExportDumpService(repository);

  const dump = await service.execute({
    startDate: "2026-04-01",
    endDate: "2026-04-30"
  });

  assert.equal(repository.findAllCalled, false);
  assert.equal(repository.requestedStartDate?.toISOString(), "2026-04-01T00:00:00.000Z");
  assert.equal(repository.requestedEndDate?.toISOString(), "2026-04-30T00:00:00.000Z");
  assert.deepEqual(dump.period, {
    startDate: "2026-04-01",
    endDate: "2026-04-30"
  });
});

Deno.test("ExportDumpService supports days shortcut", async () => {
  const repository = new FakeDailyRecordRepository();
  const service = new ExportDumpService(repository);

  await service.execute({ days: "7" });

  assert.ok(repository.requestedStartDate);
  assert.ok(repository.requestedEndDate);
  assert.equal(
    (repository.requestedEndDate.getTime() - repository.requestedStartDate.getTime()) / 86_400_000,
    6
  );
});

Deno.test("ExportDumpService renders txt and pdf exports", async () => {
  const repository = new FakeDailyRecordRepository([
    DailyRecord.rehydrate({
      id: "record-id",
      date: new Date("2026-04-15T00:00:00.000Z"),
      metrics: { energy: 4 },
      structuredNotes: null,
      tags: [],
      substances: [],
      activities: []
    })
  ]);
  const service = new ExportDumpService(repository);

  const text = await service.executeTxt();
  assert.ok(text.includes("Health Self Tracker Export"));
  assert.ok(text.includes("2026-04-15"));

  const pdf = await service.executePdf();
  const header = new TextDecoder().decode(pdf.slice(0, 8));
  assert.equal(header, "%PDF-1.4");
});

Deno.test("ExportDumpService rejects invalid export periods", async () => {
  const service = new ExportDumpService(new FakeDailyRecordRepository());

  await assert.rejects(
    () =>
      service.execute({
        startDate: "2026-04-30",
        endDate: "2026-04-01"
      }),
    /startDate cannot be after endDate/
  );

  await assert.rejects(
    () =>
      service.execute({
        days: "7",
        startDate: "2026-04-01"
      }),
    /days cannot be combined/
  );
});

class FakeDailyRecordRepository implements DailyRecordRepositoryPort {
  findAllCalled = false;
  requestedStartDate: Date | undefined;
  requestedEndDate: Date | undefined;

  constructor(private readonly records: DailyRecord[] = []) {}

  upsert(): Promise<DailyRecord> {
    throw new Error("Not implemented.");
  }

  findByDate(): Promise<DailyRecord | null> {
    throw new Error("Not implemented.");
  }

  async findByDateRange(startDate?: Date, endDate?: Date): Promise<DailyRecord[]> {
    this.requestedStartDate = startDate;
    this.requestedEndDate = endDate;
    return this.records;
  }

  async findAll(): Promise<DailyRecord[]> {
    this.findAllCalled = true;
    return this.records;
  }
}

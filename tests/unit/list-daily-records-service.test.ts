import assert from "node:assert/strict";

import { ListDailyRecordsService } from "../../src/modules/daily-record/application/use-cases/ListDailyRecordsService.ts";
import type { DailyRecordRepositoryPort } from "../../src/modules/daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecord } from "../../src/modules/daily-record/domain/entities/DailyRecord.ts";

Deno.test("ListDailyRecordsService returns an empty list for an arbitrary date without record", async () => {
  const repository = new FakeDailyRecordRepository();
  const service = new ListDailyRecordsService(repository);

  const records = await service.execute({
    date: "1990-01-01"
  });

  assert.deepEqual(records, []);
  assert.equal(repository.requestedDate?.toISOString(), "1990-01-01T00:00:00.000Z");
});

Deno.test("ListDailyRecordsService queries an inclusive arbitrary date range", async () => {
  const repository = new FakeDailyRecordRepository();
  const service = new ListDailyRecordsService(repository);

  await service.execute({
    startDate: "2026-04-01",
    endDate: "2026-04-30"
  });

  assert.equal(repository.requestedStartDate?.toISOString(), "2026-04-01T00:00:00.000Z");
  assert.equal(repository.requestedEndDate?.toISOString(), "2026-04-30T00:00:00.000Z");
});

Deno.test("ListDailyRecordsService rejects ambiguous and invalid date filters", async () => {
  const service = new ListDailyRecordsService(new FakeDailyRecordRepository());

  await assert.rejects(
    () =>
      service.execute({
        date: "2026-04-15",
        startDate: "2026-04-01"
      }),
    /date cannot be combined/
  );

  await assert.rejects(
    () =>
      service.execute({
        startDate: "2026-04-30",
        endDate: "2026-04-01"
      }),
    /startDate cannot be after endDate/
  );
});

class FakeDailyRecordRepository implements DailyRecordRepositoryPort {
  requestedDate: Date | null = null;
  requestedStartDate: Date | undefined;
  requestedEndDate: Date | undefined;

  upsert(): Promise<DailyRecord> {
    throw new Error("Not implemented.");
  }

  async findByDate(date: Date): Promise<DailyRecord | null> {
    this.requestedDate = date;
    return null;
  }

  async findByDateRange(startDate?: Date, endDate?: Date): Promise<DailyRecord[]> {
    this.requestedStartDate = startDate;
    this.requestedEndDate = endDate;
    return [];
  }

  async findAll(): Promise<DailyRecord[]> {
    return [];
  }
}

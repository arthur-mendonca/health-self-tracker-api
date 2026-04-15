import assert from "node:assert/strict";

import { UpsertDailyRecordService } from "../../src/modules/daily-record/application/use-cases/UpsertDailyRecordService.ts";
import type { DailyRecordRepositoryPort } from "../../src/modules/daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecord } from "../../src/modules/daily-record/domain/entities/DailyRecord.ts";

Deno.test("UpsertDailyRecordService builds a daily record with dynamic data", async () => {
  const repository = new FakeDailyRecordRepository();
  const service = new UpsertDailyRecordService(repository);

  const record = await service.execute({
    date: "2026-04-15",
    metrics: {
      energy: 4,
      sleepQuality: 3
    },
    structuredNotes: {
      mood: "stable"
    },
    tags: [
      {
        name: "Headache",
        category: "SYMPTOM"
      }
    ],
    substances: [
      {
        name: "Magnesium",
        type: "SUPPLEMENT",
        defaultDose: "200mg",
        exactDose: "200mg",
        effectDropTime: "NONE",
        experiencedCrash: false
      }
    ],
    activities: [
      {
        name: "Walk",
        notes: "30 minutes"
      }
    ]
  });

  assert.equal(repository.savedRecord, record);
  assert.equal(record.date.toISOString(), "2026-04-15T00:00:00.000Z");
  assert.deepEqual(record.metrics, { energy: 4, sleepQuality: 3 });
  assert.equal(record.tags[0].name, "Headache");
  assert.equal(record.tags[0].category, "SYMPTOM");
  assert.equal(record.substances[0].substance.name, "Magnesium");
  assert.equal(record.substances[0].exactDose, "200mg");
  assert.equal(record.activities[0].activity.name, "Walk");
});

Deno.test("UpsertDailyRecordService rejects invalid enum values", async () => {
  const service = new UpsertDailyRecordService(new FakeDailyRecordRepository());

  await assert.rejects(
    () =>
      service.execute({
        tags: [
          {
            name: "Unknown",
            category: "INVALID"
          }
        ]
      } as never),
    /Invalid tag category/
  );
});

class FakeDailyRecordRepository implements DailyRecordRepositoryPort {
  savedRecord: DailyRecord | null = null;

  async upsert(record: DailyRecord): Promise<DailyRecord> {
    this.savedRecord = record;
    return record;
  }

  findByDate(): Promise<DailyRecord | null> {
    throw new Error("Not implemented.");
  }

  findByDateRange(): Promise<DailyRecord[]> {
    throw new Error("Not implemented.");
  }

  findAll(): Promise<DailyRecord[]> {
    throw new Error("Not implemented.");
  }
}

import type { DailyRecord } from "../../../domain/entities/DailyRecord.ts";

export const DAILY_RECORD_REPOSITORY = "DailyRecordRepositoryPort";

export interface DailyRecordRepositoryPort {
  upsert(record: DailyRecord): Promise<DailyRecord>;
  findByDate(date: Date): Promise<DailyRecord | null>;
  findAll(): Promise<DailyRecord[]>;
}

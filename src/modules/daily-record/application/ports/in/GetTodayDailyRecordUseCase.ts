import type { DailyRecord } from "../../../domain/entities/DailyRecord.ts";

export interface GetTodayDailyRecordUseCase {
  execute(): Promise<DailyRecord | null>;
}

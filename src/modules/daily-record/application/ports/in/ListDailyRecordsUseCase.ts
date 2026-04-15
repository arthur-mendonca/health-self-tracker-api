import type { DailyRecord } from "../../../domain/entities/DailyRecord.ts";

export type ListDailyRecordsQuery = {
  date?: string;
  startDate?: string;
  endDate?: string;
};

export interface ListDailyRecordsUseCase {
  execute(query: ListDailyRecordsQuery): Promise<DailyRecord[]>;
}

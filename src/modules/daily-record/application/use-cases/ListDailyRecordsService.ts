import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { parseDateOnly } from "../../../../shared/utils/date.ts";
import type { DailyRecord } from "../../domain/entities/DailyRecord.ts";
import type { ListDailyRecordsQuery, ListDailyRecordsUseCase } from "../ports/in/ListDailyRecordsUseCase.ts";
import {
  DAILY_RECORD_REPOSITORY
} from "../ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecordRepositoryPort } from "../ports/out/DailyRecordRepositoryPort.ts";

@Injectable()
export class ListDailyRecordsService implements ListDailyRecordsUseCase {
  constructor(
    @Inject(DAILY_RECORD_REPOSITORY)
    private readonly dailyRecordRepository: DailyRecordRepositoryPort
  ) {}

  async execute(query: ListDailyRecordsQuery): Promise<DailyRecord[]> {
    if (query.date && (query.startDate || query.endDate)) {
      throw new Error("date cannot be combined with startDate or endDate.");
    }

    if (query.date) {
      const record = await this.dailyRecordRepository.findByDate(parseDateOnly(query.date));
      return record ? [record] : [];
    }

    const startDate = query.startDate ? parseDateOnly(query.startDate) : undefined;
    const endDate = query.endDate ? parseDateOnly(query.endDate) : undefined;

    if (startDate && endDate && startDate > endDate) {
      throw new Error("startDate cannot be after endDate.");
    }

    if (startDate || endDate) {
      return await this.dailyRecordRepository.findByDateRange(startDate, endDate);
    }

    return await this.dailyRecordRepository.findAll();
  }
}

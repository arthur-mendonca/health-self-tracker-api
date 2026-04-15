import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { todayDateOnlyInSaoPaulo } from "../../../../shared/utils/date.ts";
import { DailyRecord } from "../../domain/entities/DailyRecord.ts";
import type { GetTodayDailyRecordUseCase } from "../ports/in/GetTodayDailyRecordUseCase.ts";
import {
  DAILY_RECORD_REPOSITORY
} from "../ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecordRepositoryPort } from "../ports/out/DailyRecordRepositoryPort.ts";

@Injectable()
export class GetTodayDailyRecordService implements GetTodayDailyRecordUseCase {
  constructor(
    @Inject(DAILY_RECORD_REPOSITORY)
    private readonly dailyRecordRepository: DailyRecordRepositoryPort
  ) {}

  async execute(): Promise<DailyRecord | null> {
    return await this.dailyRecordRepository.findByDate(todayDateOnlyInSaoPaulo());
  }
}

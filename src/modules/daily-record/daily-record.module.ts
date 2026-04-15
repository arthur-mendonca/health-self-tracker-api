import { Module } from "npm:@nestjs/common@10.4.15";

import { DAILY_RECORD_REPOSITORY } from "./application/ports/out/DailyRecordRepositoryPort.ts";
import { GetTodayDailyRecordService } from "./application/use-cases/GetTodayDailyRecordService.ts";
import { UpsertDailyRecordService } from "./application/use-cases/UpsertDailyRecordService.ts";
import { DailyRecordController } from "./infrastructure/http/controllers/DailyRecordController.ts";
import { PrismaDailyRecordRepository } from "./infrastructure/persistence/prisma/PrismaDailyRecordRepository.ts";

@Module({
  controllers: [DailyRecordController],
  providers: [
    UpsertDailyRecordService,
    GetTodayDailyRecordService,
    {
      provide: DAILY_RECORD_REPOSITORY,
      useClass: PrismaDailyRecordRepository
    }
  ],
  exports: [DAILY_RECORD_REPOSITORY]
})
export class DailyRecordModule {}


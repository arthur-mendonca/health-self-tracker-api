import { Module } from "npm:@nestjs/common@10.4.15";

import { DailyRecordModule } from "../daily-record/daily-record.module.ts";
import { ExportDumpService } from "./application/use-cases/ExportDumpService.ts";
import { ExportController } from "./infrastructure/http/controllers/ExportController.ts";

@Module({
  imports: [DailyRecordModule],
  controllers: [ExportController],
  providers: [ExportDumpService]
})
export class ExportModule {}


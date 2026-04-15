import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "npm:@nestjs/common@10.4.15";

import { GetTodayDailyRecordService } from "../../../application/use-cases/GetTodayDailyRecordService.ts";
import { ListDailyRecordsService } from "../../../application/use-cases/ListDailyRecordsService.ts";
import { UpsertDailyRecordService } from "../../../application/use-cases/UpsertDailyRecordService.ts";
import { DailyRecordHttpMapper } from "../mappers/DailyRecordHttpMapper.ts";
import { UpsertDailyRecordDto } from "../dtos/UpsertDailyRecordDto.ts";

@Controller("records")
export class DailyRecordController {
  constructor(
    private readonly upsertDailyRecordService: UpsertDailyRecordService,
    private readonly getTodayDailyRecordService: GetTodayDailyRecordService,
    private readonly listDailyRecordsService: ListDailyRecordsService,
  ) {}

  @Post()
  async upsert(@Body() body: UpsertDailyRecordDto) {
    try {
      const record = await this.upsertDailyRecordService.execute(body);
      return DailyRecordHttpMapper.toResponse(record);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : "Invalid daily record payload.",
      );
    }
  }

  @Get("today")
  async today() {
    const record = await this.getTodayDailyRecordService.execute();
    return record ? DailyRecordHttpMapper.toResponse(record) : null;
  }

  @Get()
  async list(
    @Query("date") date?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    try {
      const records = await this.listDailyRecordsService.execute({
        date,
        startDate,
        endDate,
      });
      return records.map(DailyRecordHttpMapper.toResponse);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Invalid daily record query.",
      );
    }
  }
}

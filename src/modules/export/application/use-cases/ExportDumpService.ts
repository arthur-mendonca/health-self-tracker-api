import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import {
  DAILY_RECORD_REPOSITORY
} from "../../../daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecordRepositoryPort } from "../../../daily-record/application/ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecord } from "../../../daily-record/domain/entities/DailyRecord.ts";
import { formatDateOnly } from "../../../../shared/utils/date.ts";
import type { ExportDump, ExportDumpUseCase } from "../ports/in/ExportDumpUseCase.ts";

@Injectable()
export class ExportDumpService implements ExportDumpUseCase {
  constructor(
    @Inject(DAILY_RECORD_REPOSITORY)
    private readonly dailyRecordRepository: DailyRecordRepositoryPort
  ) {}

  async execute(): Promise<ExportDump> {
    const records = await this.dailyRecordRepository.findAll();

    return {
      generatedAt: new Date().toISOString(),
      records: records.map(toDumpRecord)
    };
  }
}

function toDumpRecord(record: DailyRecord) {
  return {
    id: record.id,
    date: formatDateOnly(record.date),
    metrics: record.metrics,
    structuredNotes: record.structuredNotes,
    tags: record.tags.map((tag) => ({
      name: tag.name,
      category: tag.category
    })),
    substances: record.substances.map((log) => ({
      name: log.substance.name,
      type: log.substance.type,
      defaultDose: log.substance.defaultDose,
      exactDose: log.exactDose,
      notes: log.notes,
      effectDropTime: log.effectDropTime,
      experiencedCrash: log.experiencedCrash
    })),
    activities: record.activities.map((log) => ({
      name: log.activity.name,
      notes: log.notes
    })),
    createdAt: record.createdAt?.toISOString(),
    updatedAt: record.updatedAt?.toISOString()
  };
}

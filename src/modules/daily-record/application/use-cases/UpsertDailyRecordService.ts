import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Activity } from "../../../activity/domain/entities/Activity.ts";
import { Substance, isSubstanceType } from "../../../substance/domain/entities/Substance.ts";
import { isTagCategory, Tag } from "../../../tag/domain/entities/Tag.ts";
import {
  createDailyActivityLog,
  createDailySubstanceLog,
  DailyRecord,
  isDropTime
} from "../../domain/entities/DailyRecord.ts";
import { parseDateOnly } from "../../../../shared/utils/date.ts";
import type { UpsertDailyRecordCommand, UpsertDailyRecordUseCase } from "../ports/in/UpsertDailyRecordUseCase.ts";
import {
  DAILY_RECORD_REPOSITORY
} from "../ports/out/DailyRecordRepositoryPort.ts";
import type { DailyRecordRepositoryPort } from "../ports/out/DailyRecordRepositoryPort.ts";

@Injectable()
export class UpsertDailyRecordService implements UpsertDailyRecordUseCase {
  constructor(
    @Inject(DAILY_RECORD_REPOSITORY)
    private readonly dailyRecordRepository: DailyRecordRepositoryPort
  ) {}

  async execute(command: UpsertDailyRecordCommand): Promise<DailyRecord> {
    const tags = uniqueByName(command.tags ?? []).map((tag) => {
      if (tag.category !== undefined && !isTagCategory(tag.category)) {
        throw new Error(`Invalid tag category for ${tag.name}.`);
      }

      return Tag.create(tag.name, tag.category ?? "GENERAL");
    });

    const substances = uniqueByName(command.substances ?? []).map((log) => {
      if (!isSubstanceType(log.type)) {
        throw new Error(`Invalid substance type for ${log.name}.`);
      }

      if (log.effectDropTime !== undefined && log.effectDropTime !== null && !isDropTime(log.effectDropTime)) {
        throw new Error(`Invalid effectDropTime for ${log.name}.`);
      }

      return createDailySubstanceLog({
        substance: Substance.create(log.name, log.type, log.defaultDose),
        exactDose: log.exactDose,
        notes: log.notes,
        effectDropTime: log.effectDropTime,
        experiencedCrash: log.experiencedCrash ?? false
      });
    });

    const activities = uniqueByName(command.activities ?? []).map((log) =>
      createDailyActivityLog({
        activity: Activity.create(log.name),
        notes: log.notes
      })
    );

    const record = DailyRecord.create({
      date: parseDateOnly(command.date),
      metrics: command.metrics ?? null,
      structuredNotes: command.structuredNotes ?? null,
      tags,
      substances,
      activities
    });

    return await this.dailyRecordRepository.upsert(record);
  }
}

function uniqueByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const key = item.name.trim().toLocaleLowerCase();

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(item);
  }

  return unique;
}

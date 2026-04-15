import { Activity } from "../../../../activity/domain/entities/Activity.ts";
import { Substance } from "../../../../substance/domain/entities/Substance.ts";
import type { SubstanceType } from "../../../../substance/domain/entities/Substance.ts";
import { Tag } from "../../../../tag/domain/entities/Tag.ts";
import type { TagCategory } from "../../../../tag/domain/entities/Tag.ts";
import type { JsonObject } from "../../../../../shared/domain/types/json-value.ts";
import { DailyRecord } from "../../../domain/entities/DailyRecord.ts";
import type { DropTime } from "../../../domain/entities/DailyRecord.ts";

type DailyRecordModel = {
  id: string;
  date: Date;
  metrics: unknown;
  structuredNotes: unknown;
  tags: Array<{
    id: string;
    name: string;
    category: TagCategory;
    createdAt: Date;
  }>;
  substances: Array<{
    id: string;
    exactDose: string;
    notes: string | null;
    effectDropTime: DropTime | null;
    experiencedCrash: boolean;
    substance: {
      id: string;
      name: string;
      type: SubstanceType;
      defaultDose: string | null;
    };
  }>;
  activities: Array<{
    id: string;
    notes: string | null;
    activity: {
      id: string;
      name: string;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export class DailyRecordPrismaMapper {
  static toDomain(model: DailyRecordModel): DailyRecord {
    return DailyRecord.rehydrate({
      id: model.id,
      date: model.date,
      metrics: model.metrics as JsonObject | null,
      structuredNotes: model.structuredNotes as JsonObject | null,
      tags: model.tags.map((tag) =>
        Tag.rehydrate({
          id: tag.id,
          name: tag.name,
          category: tag.category,
          createdAt: tag.createdAt
        })
      ),
      substances: model.substances.map((log) => ({
        id: log.id,
        substance: Substance.rehydrate({
          id: log.substance.id,
          name: log.substance.name,
          type: log.substance.type,
          defaultDose: log.substance.defaultDose
        }),
        exactDose: log.exactDose,
        notes: log.notes,
        effectDropTime: log.effectDropTime,
        experiencedCrash: log.experiencedCrash
      })),
      activities: model.activities.map((log) => ({
        id: log.id,
        activity: Activity.rehydrate({
          id: log.activity.id,
          name: log.activity.name
        }),
        notes: log.notes
      })),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    });
  }
}

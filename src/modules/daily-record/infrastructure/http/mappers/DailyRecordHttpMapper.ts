import { formatDateOnly } from "../../../../../shared/utils/date.ts";
import { DailyRecord } from "../../../domain/entities/DailyRecord.ts";

export class DailyRecordHttpMapper {
  static toResponse(record: DailyRecord) {
    return {
      id: record.id,
      date: formatDateOnly(record.date),
      metrics: record.metrics,
      structuredNotes: record.structuredNotes,
      tags: record.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        category: tag.category
      })),
      substances: record.substances.map((log) => ({
        id: log.id,
        substance: {
          id: log.substance.id,
          name: log.substance.name,
          type: log.substance.type,
          defaultDose: log.substance.defaultDose
        },
        exactDose: log.exactDose,
        notes: log.notes,
        effectDropTime: log.effectDropTime,
        experiencedCrash: log.experiencedCrash
      })),
      activities: record.activities.map((log) => ({
        id: log.id,
        activity: {
          id: log.activity.id,
          name: log.activity.name
        },
        notes: log.notes
      })),
      createdAt: record.createdAt?.toISOString(),
      updatedAt: record.updatedAt?.toISOString()
    };
  }
}


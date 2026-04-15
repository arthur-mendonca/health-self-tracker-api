import { Injectable } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service.ts";
import { DailyRecord } from "../../../domain/entities/DailyRecord.ts";
import type { DailyRecordRepositoryPort } from "../../../application/ports/out/DailyRecordRepositoryPort.ts";
import { DailyRecordPrismaMapper } from "../mappers/DailyRecordPrismaMapper.ts";

const includeRelations = {
  tags: true,
  substances: {
    include: {
      substance: true
    }
  },
  activities: {
    include: {
      activity: true
    }
  }
} as const;

@Injectable()
export class PrismaDailyRecordRepository implements DailyRecordRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(record: DailyRecord): Promise<DailyRecord> {
    const model = await this.prisma.dailyRecord.upsert({
      where: { date: record.date },
      create: {
        id: record.id,
        date: record.date,
        metrics: record.metrics,
        structuredNotes: record.structuredNotes,
        tags: {
          connectOrCreate: record.tags.map((tag) => ({
            where: { name: tag.name },
            create: {
              id: tag.id,
              name: tag.name,
              category: tag.category
            }
          }))
        },
        substances: {
          create: record.substances.map((log) => ({
            id: log.id,
            exactDose: log.exactDose,
            notes: log.notes,
            effectDropTime: log.effectDropTime,
            experiencedCrash: log.experiencedCrash,
            substance: {
              connectOrCreate: {
                where: { name: log.substance.name },
                create: {
                  id: log.substance.id,
                  name: log.substance.name,
                  type: log.substance.type,
                  defaultDose: log.substance.defaultDose
                }
              }
            }
          }))
        },
        activities: {
          create: record.activities.map((log) => ({
            id: log.id,
            notes: log.notes,
            activity: {
              connectOrCreate: {
                where: { name: log.activity.name },
                create: {
                  id: log.activity.id,
                  name: log.activity.name
                }
              }
            }
          }))
        }
      },
      update: {
        metrics: record.metrics,
        structuredNotes: record.structuredNotes,
        tags: {
          set: [],
          connectOrCreate: record.tags.map((tag) => ({
            where: { name: tag.name },
            create: {
              id: tag.id,
              name: tag.name,
              category: tag.category
            }
          }))
        },
        substances: {
          deleteMany: {},
          create: record.substances.map((log) => ({
            id: log.id,
            exactDose: log.exactDose,
            notes: log.notes,
            effectDropTime: log.effectDropTime,
            experiencedCrash: log.experiencedCrash,
            substance: {
              connectOrCreate: {
                where: { name: log.substance.name },
                create: {
                  id: log.substance.id,
                  name: log.substance.name,
                  type: log.substance.type,
                  defaultDose: log.substance.defaultDose
                }
              }
            }
          }))
        },
        activities: {
          deleteMany: {},
          create: record.activities.map((log) => ({
            id: log.id,
            notes: log.notes,
            activity: {
              connectOrCreate: {
                where: { name: log.activity.name },
                create: {
                  id: log.activity.id,
                  name: log.activity.name
                }
              }
            }
          }))
        }
      },
      include: includeRelations
    });

    return DailyRecordPrismaMapper.toDomain(model);
  }

  async findByDate(date: Date): Promise<DailyRecord | null> {
    const model = await this.prisma.dailyRecord.findUnique({
      where: { date },
      include: includeRelations
    });

    return model ? DailyRecordPrismaMapper.toDomain(model) : null;
  }

  async findAll(): Promise<DailyRecord[]> {
    const models = await this.prisma.dailyRecord.findMany({
      orderBy: { date: "asc" },
      include: includeRelations
    });

    return models.map(DailyRecordPrismaMapper.toDomain);
  }
}

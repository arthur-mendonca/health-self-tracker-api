import { Injectable } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service.ts";
import { Activity } from "../../../domain/entities/Activity.ts";
import type {
  ActivityRepositoryPort,
  UpdateActivityData
} from "../../../application/ports/out/ActivityRepositoryPort.ts";
import { ActivityPrismaMapper } from "../mappers/ActivityPrismaMapper.ts";

@Injectable()
export class PrismaActivityRepository implements ActivityRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(activity: Activity): Promise<Activity> {
    const model = await this.prisma.activity.upsert({
      where: { name: activity.name },
      create: {
        id: activity.id,
        name: activity.name
      },
      update: {}
    });

    return ActivityPrismaMapper.toDomain(model);
  }

  async list(): Promise<Activity[]> {
    const models = await this.prisma.activity.findMany({
      orderBy: { name: "asc" }
    });

    return models.map(ActivityPrismaMapper.toDomain);
  }

  async update(id: string, data: UpdateActivityData): Promise<Activity | null> {
    const current = await this.prisma.activity.findUnique({
      where: { id }
    });

    if (!current) {
      return null;
    }

    const model = await this.prisma.activity.update({
      where: { id },
      data: {
        name: data.name
      }
    });

    return ActivityPrismaMapper.toDomain(model);
  }

  async delete(id: string): Promise<boolean> {
    const current = await this.prisma.activity.findUnique({
      where: { id }
    });

    if (!current) {
      return false;
    }

    await this.prisma.$transaction([
      this.prisma.dailyActivity.deleteMany({
        where: { activityId: id }
      }),
      this.prisma.activity.delete({
        where: { id }
      })
    ]);

    return true;
  }
}

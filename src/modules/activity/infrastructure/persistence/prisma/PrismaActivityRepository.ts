import { Injectable } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service.ts";
import { Activity } from "../../../domain/entities/Activity.ts";
import type { ActivityRepositoryPort } from "../../../application/ports/out/ActivityRepositoryPort.ts";
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
}

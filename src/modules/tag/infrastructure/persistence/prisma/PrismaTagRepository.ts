import { Injectable } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service.ts";
import { Tag } from "../../../domain/entities/Tag.ts";
import type { TagRepositoryPort, UpdateTagData } from "../../../application/ports/out/TagRepositoryPort.ts";
import { TagPrismaMapper } from "../mappers/TagPrismaMapper.ts";

@Injectable()
export class PrismaTagRepository implements TagRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(tag: Tag): Promise<Tag> {
    const model = await this.prisma.tag.upsert({
      where: { name: tag.name },
      create: {
        id: tag.id,
        name: tag.name,
        category: tag.category
      },
      update: {
        category: tag.category
      }
    });

    return TagPrismaMapper.toDomain(model);
  }

  async list(): Promise<Tag[]> {
    const models = await this.prisma.tag.findMany({
      orderBy: { name: "asc" }
    });

    return models.map(TagPrismaMapper.toDomain);
  }

  async update(id: string, data: UpdateTagData): Promise<Tag | null> {
    const current = await this.prisma.tag.findUnique({
      where: { id }
    });

    if (!current) {
      return null;
    }

    const model = await this.prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category
      }
    });

    return TagPrismaMapper.toDomain(model);
  }

  async delete(id: string): Promise<boolean> {
    const current = await this.prisma.tag.findUnique({
      where: { id }
    });

    if (!current) {
      return false;
    }

    await this.prisma.tag.delete({
      where: { id }
    });

    return true;
  }
}

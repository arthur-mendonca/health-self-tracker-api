import { Injectable } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service.ts";
import { Substance } from "../../../domain/entities/Substance.ts";
import type {
  SubstanceRepositoryPort,
  UpdateSubstanceData
} from "../../../application/ports/out/SubstanceRepositoryPort.ts";
import { SubstancePrismaMapper } from "../mappers/SubstancePrismaMapper.ts";

@Injectable()
export class PrismaSubstanceRepository implements SubstanceRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(substance: Substance): Promise<Substance> {
    const model = await this.prisma.substance.upsert({
      where: { name: substance.name },
      create: {
        id: substance.id,
        name: substance.name,
        type: substance.type,
        defaultDose: substance.defaultDose
      },
      update: {
        type: substance.type,
        defaultDose: substance.defaultDose
      }
    });

    return SubstancePrismaMapper.toDomain(model);
  }

  async list(): Promise<Substance[]> {
    const models = await this.prisma.substance.findMany({
      orderBy: { name: "asc" }
    });

    return models.map(SubstancePrismaMapper.toDomain);
  }

  async update(id: string, data: UpdateSubstanceData): Promise<Substance | null> {
    const current = await this.prisma.substance.findUnique({
      where: { id }
    });

    if (!current) {
      return null;
    }

    const model = await this.prisma.substance.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        defaultDose: data.defaultDose
      }
    });

    return SubstancePrismaMapper.toDomain(model);
  }

  async delete(id: string): Promise<boolean> {
    const current = await this.prisma.substance.findUnique({
      where: { id }
    });

    if (!current) {
      return false;
    }

    await this.prisma.$transaction([
      this.prisma.dailySubstance.deleteMany({
        where: { substanceId: id }
      }),
      this.prisma.substance.delete({
        where: { id }
      })
    ]);

    return true;
  }
}

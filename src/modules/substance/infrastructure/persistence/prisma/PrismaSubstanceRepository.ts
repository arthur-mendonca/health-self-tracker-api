import { Injectable } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service.ts";
import { Substance } from "../../../domain/entities/Substance.ts";
import type { SubstanceRepositoryPort } from "../../../application/ports/out/SubstanceRepositoryPort.ts";
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
}

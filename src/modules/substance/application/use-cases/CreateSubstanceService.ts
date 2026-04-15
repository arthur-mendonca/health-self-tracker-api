import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Substance } from "../../domain/entities/Substance.ts";
import type { CreateSubstanceCommand, CreateSubstanceUseCase } from "../ports/in/CreateSubstanceUseCase.ts";
import { SUBSTANCE_REPOSITORY } from "../ports/out/SubstanceRepositoryPort.ts";
import type { SubstanceRepositoryPort } from "../ports/out/SubstanceRepositoryPort.ts";

@Injectable()
export class CreateSubstanceService implements CreateSubstanceUseCase {
  constructor(
    @Inject(SUBSTANCE_REPOSITORY)
    private readonly substanceRepository: SubstanceRepositoryPort
  ) {}

  async execute(command: CreateSubstanceCommand): Promise<Substance> {
    const substance = Substance.create(command.name, command.type, command.defaultDose);
    return await this.substanceRepository.create(substance);
  }
}

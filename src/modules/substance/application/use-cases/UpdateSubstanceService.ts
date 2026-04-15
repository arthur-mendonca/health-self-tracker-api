import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import type { Substance } from "../../domain/entities/Substance.ts";
import type { UpdateSubstanceCommand, UpdateSubstanceUseCase } from "../ports/in/UpdateSubstanceUseCase.ts";
import { SUBSTANCE_REPOSITORY } from "../ports/out/SubstanceRepositoryPort.ts";
import type { SubstanceRepositoryPort } from "../ports/out/SubstanceRepositoryPort.ts";

@Injectable()
export class UpdateSubstanceService implements UpdateSubstanceUseCase {
  constructor(
    @Inject(SUBSTANCE_REPOSITORY)
    private readonly substanceRepository: SubstanceRepositoryPort
  ) {}

  async execute(command: UpdateSubstanceCommand): Promise<Substance | null> {
    if (command.name === undefined && command.type === undefined && command.defaultDose === undefined) {
      throw new Error("At least one substance field must be provided.");
    }

    const name = command.name?.trim();
    const defaultDose = command.defaultDose?.trim() || null;

    if (command.name !== undefined && !name) {
      throw new Error("Substance name is required.");
    }

    return await this.substanceRepository.update(command.id, {
      name,
      type: command.type,
      defaultDose: command.defaultDose === undefined ? undefined : defaultDose
    });
  }
}

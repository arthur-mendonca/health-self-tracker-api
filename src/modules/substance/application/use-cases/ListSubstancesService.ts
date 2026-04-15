import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Substance } from "../../domain/entities/Substance.ts";
import type { ListSubstancesUseCase } from "../ports/in/ListSubstancesUseCase.ts";
import { SUBSTANCE_REPOSITORY } from "../ports/out/SubstanceRepositoryPort.ts";
import type { SubstanceRepositoryPort } from "../ports/out/SubstanceRepositoryPort.ts";

@Injectable()
export class ListSubstancesService implements ListSubstancesUseCase {
  constructor(
    @Inject(SUBSTANCE_REPOSITORY)
    private readonly substanceRepository: SubstanceRepositoryPort
  ) {}

  async execute(): Promise<Substance[]> {
    return await this.substanceRepository.list();
  }
}

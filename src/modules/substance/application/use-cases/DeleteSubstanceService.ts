import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import type { DeleteSubstanceUseCase } from "../ports/in/DeleteSubstanceUseCase.ts";
import { SUBSTANCE_REPOSITORY } from "../ports/out/SubstanceRepositoryPort.ts";
import type { SubstanceRepositoryPort } from "../ports/out/SubstanceRepositoryPort.ts";

@Injectable()
export class DeleteSubstanceService implements DeleteSubstanceUseCase {
  constructor(
    @Inject(SUBSTANCE_REPOSITORY)
    private readonly substanceRepository: SubstanceRepositoryPort
  ) {}

  async execute(id: string): Promise<boolean> {
    return await this.substanceRepository.delete(id);
  }
}

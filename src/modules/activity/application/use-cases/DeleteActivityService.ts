import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import type { DeleteActivityUseCase } from "../ports/in/DeleteActivityUseCase.ts";
import { ACTIVITY_REPOSITORY } from "../ports/out/ActivityRepositoryPort.ts";
import type { ActivityRepositoryPort } from "../ports/out/ActivityRepositoryPort.ts";

@Injectable()
export class DeleteActivityService implements DeleteActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort
  ) {}

  async execute(id: string): Promise<boolean> {
    return await this.activityRepository.delete(id);
  }
}

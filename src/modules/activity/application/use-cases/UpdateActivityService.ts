import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import type { Activity } from "../../domain/entities/Activity.ts";
import type { UpdateActivityCommand, UpdateActivityUseCase } from "../ports/in/UpdateActivityUseCase.ts";
import { ACTIVITY_REPOSITORY } from "../ports/out/ActivityRepositoryPort.ts";
import type { ActivityRepositoryPort } from "../ports/out/ActivityRepositoryPort.ts";

@Injectable()
export class UpdateActivityService implements UpdateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort
  ) {}

  async execute(command: UpdateActivityCommand): Promise<Activity | null> {
    if (command.name === undefined) {
      throw new Error("At least one activity field must be provided.");
    }

    const name = command.name.trim();

    if (!name) {
      throw new Error("Activity name is required.");
    }

    return await this.activityRepository.update(command.id, { name });
  }
}

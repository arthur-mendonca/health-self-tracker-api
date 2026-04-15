import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Activity } from "../../domain/entities/Activity.ts";
import type { CreateActivityCommand, CreateActivityUseCase } from "../ports/in/CreateActivityUseCase.ts";
import { ACTIVITY_REPOSITORY } from "../ports/out/ActivityRepositoryPort.ts";
import type { ActivityRepositoryPort } from "../ports/out/ActivityRepositoryPort.ts";

@Injectable()
export class CreateActivityService implements CreateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort
  ) {}

  async execute(command: CreateActivityCommand): Promise<Activity> {
    const activity = Activity.create(command.name);
    return await this.activityRepository.create(activity);
  }
}

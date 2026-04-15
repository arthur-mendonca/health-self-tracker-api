import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Activity } from "../../domain/entities/Activity.ts";
import type { ListActivitiesUseCase } from "../ports/in/ListActivitiesUseCase.ts";
import { ACTIVITY_REPOSITORY } from "../ports/out/ActivityRepositoryPort.ts";
import type { ActivityRepositoryPort } from "../ports/out/ActivityRepositoryPort.ts";

@Injectable()
export class ListActivitiesService implements ListActivitiesUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepositoryPort
  ) {}

  async execute(): Promise<Activity[]> {
    return await this.activityRepository.list();
  }
}

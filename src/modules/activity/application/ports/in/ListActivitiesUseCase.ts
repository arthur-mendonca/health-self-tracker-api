import type { Activity } from "../../../domain/entities/Activity.ts";

export interface ListActivitiesUseCase {
  execute(): Promise<Activity[]>;
}

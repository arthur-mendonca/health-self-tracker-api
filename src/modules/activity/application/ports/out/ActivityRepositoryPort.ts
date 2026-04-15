import type { Activity } from "../../../domain/entities/Activity.ts";

export const ACTIVITY_REPOSITORY = "ActivityRepositoryPort";

export interface ActivityRepositoryPort {
  create(activity: Activity): Promise<Activity>;
  list(): Promise<Activity[]>;
}

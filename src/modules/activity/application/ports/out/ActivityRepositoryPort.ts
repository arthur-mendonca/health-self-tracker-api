import type { Activity } from "../../../domain/entities/Activity.ts";

export const ACTIVITY_REPOSITORY = "ActivityRepositoryPort";

export type UpdateActivityData = {
  name?: string;
};

export interface ActivityRepositoryPort {
  create(activity: Activity): Promise<Activity>;
  list(): Promise<Activity[]>;
  update(id: string, data: UpdateActivityData): Promise<Activity | null>;
  delete(id: string): Promise<boolean>;
}

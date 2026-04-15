import type { Activity } from "../../../domain/entities/Activity.ts";

export type CreateActivityCommand = {
  name: string;
};

export interface CreateActivityUseCase {
  execute(command: CreateActivityCommand): Promise<Activity>;
}

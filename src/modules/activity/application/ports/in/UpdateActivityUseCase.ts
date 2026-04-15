import type { Activity } from "../../../domain/entities/Activity.ts";

export type UpdateActivityCommand = {
  id: string;
  name?: string;
};

export interface UpdateActivityUseCase {
  execute(command: UpdateActivityCommand): Promise<Activity | null>;
}

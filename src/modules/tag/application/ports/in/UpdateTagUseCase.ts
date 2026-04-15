import type { Tag, TagCategory } from "../../../domain/entities/Tag.ts";

export type UpdateTagCommand = {
  id: string;
  name?: string;
  category?: TagCategory;
};

export interface UpdateTagUseCase {
  execute(command: UpdateTagCommand): Promise<Tag | null>;
}

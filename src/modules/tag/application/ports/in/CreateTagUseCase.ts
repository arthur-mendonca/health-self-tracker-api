import type { Tag, TagCategory } from "../../../domain/entities/Tag.ts";

export type CreateTagCommand = {
  name: string;
  category?: TagCategory;
};

export interface CreateTagUseCase {
  execute(command: CreateTagCommand): Promise<Tag>;
}

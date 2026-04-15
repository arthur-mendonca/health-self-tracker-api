import type { Tag, TagCategory } from "../../../domain/entities/Tag.ts";

export const TAG_REPOSITORY = "TagRepositoryPort";

export type UpdateTagData = {
  name?: string;
  category?: TagCategory;
};

export interface TagRepositoryPort {
  create(tag: Tag): Promise<Tag>;
  list(): Promise<Tag[]>;
  update(id: string, data: UpdateTagData): Promise<Tag | null>;
  delete(id: string): Promise<boolean>;
}

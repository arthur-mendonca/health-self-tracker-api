import type { Tag } from "../../../domain/entities/Tag.ts";

export const TAG_REPOSITORY = "TagRepositoryPort";

export interface TagRepositoryPort {
  create(tag: Tag): Promise<Tag>;
  list(): Promise<Tag[]>;
}

import type { Tag } from "../../../domain/entities/Tag.ts";

export interface ListTagsUseCase {
  execute(): Promise<Tag[]>;
}

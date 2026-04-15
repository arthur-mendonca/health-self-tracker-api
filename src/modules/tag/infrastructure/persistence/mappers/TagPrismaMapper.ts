import { Tag } from "../../../domain/entities/Tag.ts";
import type { TagCategory } from "../../../domain/entities/Tag.ts";

export class TagPrismaMapper {
  static toDomain(model: { id: string; name: string; category: TagCategory; createdAt?: Date }): Tag {
    return Tag.rehydrate({
      id: model.id,
      name: model.name,
      category: model.category,
      createdAt: model.createdAt
    });
  }
}

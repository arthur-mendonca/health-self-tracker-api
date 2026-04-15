import type { TagCategory } from "../../../domain/entities/Tag.ts";

export type CreateTagDto = {
  name: string;
  category?: TagCategory;
};

import { ulid } from "npm:ulid@3.0.1";

export type TagCategory = "SYMPTOM" | "INTERFERENCE" | "TRIGGER" | "RESCUE" | "GENERAL";

export const tagCategories = ["SYMPTOM", "INTERFERENCE", "TRIGGER", "RESCUE", "GENERAL"] as const;

type TagProps = {
  id: string;
  name: string;
  category: TagCategory;
  createdAt?: Date;
};

export class Tag {
  readonly id: string;
  readonly name: string;
  readonly category: TagCategory;
  readonly createdAt?: Date;

  private constructor(props: TagProps) {
    const name = props.name.trim();

    if (!name) {
      throw new Error("Tag name is required.");
    }

    this.id = props.id;
    this.name = name;
    this.category = props.category;
    this.createdAt = props.createdAt;
  }

  static create(name: string, category: TagCategory = "GENERAL"): Tag {
    return new Tag({
      id: ulid(),
      name,
      category
    });
  }

  static rehydrate(props: TagProps): Tag {
    return new Tag(props);
  }
}

export function isTagCategory(value: unknown): value is TagCategory {
  return tagCategories.includes(value as TagCategory);
}

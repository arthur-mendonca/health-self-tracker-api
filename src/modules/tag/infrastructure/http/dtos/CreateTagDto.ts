import { IsEnum, IsOptional, IsString, MinLength } from "npm:class-validator@0.14.1";

import { tagCategories, type TagCategory } from "../../../domain/entities/Tag.ts";

export class CreateTagDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsEnum(tagCategories)
  category?: TagCategory;
}

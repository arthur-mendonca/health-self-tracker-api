import { Type } from "npm:class-transformer@0.5.1";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested
} from "npm:class-validator@0.14.1";

import { substanceTypes, type SubstanceType } from "../../../../substance/domain/entities/Substance.ts";
import { tagCategories, type TagCategory } from "../../../../tag/domain/entities/Tag.ts";
import type { JsonObject } from "../../../../../shared/domain/types/json-value.ts";
import { dropTimes, type DropTime } from "../../../domain/entities/DailyRecord.ts";

export class UpsertDailyRecordTagDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsEnum(tagCategories)
  category?: TagCategory;
}

export class UpsertDailyRecordSubstanceDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEnum(substanceTypes)
  type!: SubstanceType;

  @IsOptional()
  @IsString()
  defaultDose?: string | null;

  @IsString()
  @MinLength(1)
  exactDose!: string;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsEnum(dropTimes)
  effectDropTime?: DropTime | null;

  @IsOptional()
  @IsBoolean()
  experiencedCrash?: boolean;
}

export class UpsertDailyRecordActivityDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  notes?: string | null;
}

export class UpsertDailyRecordDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsObject()
  metrics?: JsonObject | null;

  @IsOptional()
  @IsObject()
  structuredNotes?: JsonObject | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertDailyRecordTagDto)
  tags?: UpsertDailyRecordTagDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertDailyRecordSubstanceDto)
  substances?: UpsertDailyRecordSubstanceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertDailyRecordActivityDto)
  activities?: UpsertDailyRecordActivityDto[];
}

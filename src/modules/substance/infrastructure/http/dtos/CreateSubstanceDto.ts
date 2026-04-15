import { IsEnum, IsOptional, IsString, MinLength } from "npm:class-validator@0.14.1";

import { substanceTypes, type SubstanceType } from "../../../domain/entities/Substance.ts";

export class CreateSubstanceDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEnum(substanceTypes)
  type!: SubstanceType;

  @IsOptional()
  @IsString()
  defaultDose?: string | null;
}

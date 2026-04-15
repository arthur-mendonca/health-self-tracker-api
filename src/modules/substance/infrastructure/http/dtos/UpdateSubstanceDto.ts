import { IsEnum, IsOptional, IsString, MinLength } from "npm:class-validator@0.14.1";

import { substanceTypes, type SubstanceType } from "../../../domain/entities/Substance.ts";

export class UpdateSubstanceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(substanceTypes)
  type?: SubstanceType;

  @IsOptional()
  @IsString()
  defaultDose?: string | null;
}

import { IsOptional, IsString, MinLength } from "npm:class-validator@0.14.1";

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}

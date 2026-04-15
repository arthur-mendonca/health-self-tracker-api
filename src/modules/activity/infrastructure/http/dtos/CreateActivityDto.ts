import { IsString, MinLength } from "npm:class-validator@0.14.1";

export class CreateActivityDto {
  @IsString()
  @MinLength(1)
  name!: string;
}

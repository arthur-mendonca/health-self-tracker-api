import { IsEmail, IsString, MinLength } from "npm:class-validator@0.14.1";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

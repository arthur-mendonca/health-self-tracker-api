import { Body, Controller, Post } from "npm:@nestjs/common@10.4.15";

import { Public } from "../../../../../shared/auth/public.ts";
import { LoginService } from "../../../application/use-cases/LoginService.ts";
import { LoginDto } from "../dtos/LoginDto.ts";

@Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  @Post("login")
  async login(@Body() body: LoginDto) {
    return await this.loginService.execute(body);
  }
}

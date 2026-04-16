import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from "npm:@nestjs/common@10.4.15";

import { Public } from "../../../../../shared/auth/public.ts";
import type { AuthenticatedUser } from "../../../../../shared/auth/authenticated-user.ts";
import {
  serializeClearSessionCookie,
  serializeSessionCookie,
} from "../../../../../shared/auth/session-cookie.ts";
import { LoginService } from "../../../application/use-cases/LoginService.ts";
import { LoginDto } from "../dtos/LoginDto.ts";

@Controller("auth")
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post("login")
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: ResponseLike) {
    const result = await this.loginService.execute(body);
    response.setHeader("Set-Cookie", serializeSessionCookie(result.token));
    return result;
  }

  @Public()
  @Post("logout")
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: ResponseLike): void {
    response.setHeader("Set-Cookie", serializeClearSessionCookie());
  }

  @Get("me")
  me(@Req() request: RequestLike): AuthenticatedUser {
    return request.user;
  }
}

type RequestLike = {
  user: AuthenticatedUser;
};

type ResponseLike = {
  setHeader(name: string, value: string): void;
};

import { Injectable, UnauthorizedException } from "npm:@nestjs/common@10.4.15";

import { getJwtSecret } from "../../../../shared/auth/auth.guard.ts";
import { verifyPassword } from "../../../../shared/auth/password.ts";
import { signJwt } from "../../../../shared/auth/jwt.ts";
import { PrismaService } from "../../../../shared/infrastructure/prisma/prisma.service.ts";

export type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: LoginInput): Promise<{ token: string }> {
    const email = input.email.trim().toLowerCase();
    const user = await this.prisma.authUser.findUnique({
      where: {
        email
      }
    });

    if (!user || !(await verifyPassword(input.password, user.passwordHash, user.passwordSalt))) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const secret = getJwtSecret();

    return {
      token: await signJwt({
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        purpose: "api_access",
        sub: user.id
      }, secret)
    };
  }
}

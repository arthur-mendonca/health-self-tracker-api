import { Injectable, Logger, OnModuleInit } from "npm:@nestjs/common@10.4.15";
import { ulid } from "npm:ulid@3.0.1";

import { hashPassword } from "../../../../shared/auth/password.ts";
import { PrismaService } from "../../../../shared/infrastructure/prisma/prisma.service.ts";

@Injectable()
export class BootstrapAuthUserService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapAuthUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    const email = Deno.env.get("AUTH_USER_EMAIL")?.trim().toLowerCase();
    const password = Deno.env.get("AUTH_USER_PASSWORD");

    if (!email || !password) {
      this.logger.warn("AUTH_USER_EMAIL and AUTH_USER_PASSWORD are not set; login is disabled.");
      return;
    }

    const { hash, salt } = await hashPassword(password);
    await this.prisma.authUser.upsert({
      create: {
        email,
        id: ulid(),
        passwordHash: hash,
        passwordSalt: salt
      },
      update: {
        passwordHash: hash,
        passwordSalt: salt
      },
      where: {
        email
      }
    });
  }
}

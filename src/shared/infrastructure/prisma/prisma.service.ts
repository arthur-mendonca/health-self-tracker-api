import { Injectable, OnModuleDestroy, OnModuleInit } from "npm:@nestjs/common@10.4.15";
import { PrismaPg } from "npm:@prisma/adapter-pg@7.7.0";

import { PrismaClient } from "../../../generated/prisma/client.ts";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = Deno.env.get("DATABASE_URL");

    if (!connectionString) {
      throw new Error("DATABASE_URL is required to initialize Prisma.");
    }

    super({
      adapter: new PrismaPg({ connectionString })
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

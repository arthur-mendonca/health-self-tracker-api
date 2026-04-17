import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "npm:@nestjs/common@10.4.15";
import { PrismaPg } from "npm:@prisma/adapter-pg@7.7.0";

import { PrismaClient } from "../../../generated/prisma/client.ts";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly datasourceSummary: string;

  constructor() {
    const connectionString = Deno.env.get("DATABASE_URL");

    if (!connectionString) {
      throw new Error("DATABASE_URL is required to initialize Prisma.");
    }

    const datasourceSummary = summarizeDatabaseUrl(connectionString);

    super({
      adapter: new PrismaPg({ connectionString })
    });

    this.datasourceSummary = datasourceSummary;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.$queryRawUnsafe("SELECT 1");
    this.logger.log(`Prisma connected to ${this.datasourceSummary}.`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

function summarizeDatabaseUrl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const port = url.port ? `:${url.port}` : "";
    const database = url.pathname.replace(/^\//, "") || "(missing database)";
    const username = url.username || "(missing user)";

    return `${url.protocol}//${username}@${url.hostname}${port}/${database}`;
  } catch {
    return "an invalid DATABASE_URL";
  }
}

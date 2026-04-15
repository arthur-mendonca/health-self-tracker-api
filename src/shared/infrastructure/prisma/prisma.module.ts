import { Global, Module } from "npm:@nestjs/common@10.4.15";

import { PrismaService } from "./prisma.service.ts";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}


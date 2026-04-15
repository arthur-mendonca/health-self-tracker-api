import { Module } from "npm:@nestjs/common@10.4.15";

import { PrismaModule } from "../../shared/infrastructure/prisma/prisma.module.ts";
import { BootstrapAuthUserService } from "./application/use-cases/BootstrapAuthUserService.ts";
import { LoginService } from "./application/use-cases/LoginService.ts";
import { AuthController } from "./infrastructure/http/controllers/AuthController.ts";

@Module({
  controllers: [AuthController],
  imports: [PrismaModule],
  providers: [
    BootstrapAuthUserService,
    LoginService
  ]
})
export class AuthModule {}

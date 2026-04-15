import { Module } from "npm:@nestjs/common@10.4.15";

import { SUBSTANCE_REPOSITORY } from "./application/ports/out/SubstanceRepositoryPort.ts";
import { CreateSubstanceService } from "./application/use-cases/CreateSubstanceService.ts";
import { DeleteSubstanceService } from "./application/use-cases/DeleteSubstanceService.ts";
import { ListSubstancesService } from "./application/use-cases/ListSubstancesService.ts";
import { UpdateSubstanceService } from "./application/use-cases/UpdateSubstanceService.ts";
import { SubstanceController } from "./infrastructure/http/controllers/SubstanceController.ts";
import { PrismaSubstanceRepository } from "./infrastructure/persistence/prisma/PrismaSubstanceRepository.ts";

@Module({
  controllers: [SubstanceController],
  providers: [
    CreateSubstanceService,
    ListSubstancesService,
    UpdateSubstanceService,
    DeleteSubstanceService,
    {
      provide: SUBSTANCE_REPOSITORY,
      useClass: PrismaSubstanceRepository
    }
  ],
  exports: [CreateSubstanceService, ListSubstancesService, UpdateSubstanceService, DeleteSubstanceService]
})
export class SubstanceModule {}

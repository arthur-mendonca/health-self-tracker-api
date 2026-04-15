import { Module } from "npm:@nestjs/common@10.4.15";

import { ACTIVITY_REPOSITORY } from "./application/ports/out/ActivityRepositoryPort.ts";
import { CreateActivityService } from "./application/use-cases/CreateActivityService.ts";
import { DeleteActivityService } from "./application/use-cases/DeleteActivityService.ts";
import { ListActivitiesService } from "./application/use-cases/ListActivitiesService.ts";
import { UpdateActivityService } from "./application/use-cases/UpdateActivityService.ts";
import { ActivityController } from "./infrastructure/http/controllers/ActivityController.ts";
import { PrismaActivityRepository } from "./infrastructure/persistence/prisma/PrismaActivityRepository.ts";

@Module({
  controllers: [ActivityController],
  providers: [
    CreateActivityService,
    ListActivitiesService,
    UpdateActivityService,
    DeleteActivityService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: PrismaActivityRepository
    }
  ],
  exports: [CreateActivityService, ListActivitiesService, UpdateActivityService, DeleteActivityService]
})
export class ActivityModule {}

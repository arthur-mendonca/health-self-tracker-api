import { Module } from "npm:@nestjs/common@10.4.15";

import { TAG_REPOSITORY } from "./application/ports/out/TagRepositoryPort.ts";
import { CreateTagService } from "./application/use-cases/CreateTagService.ts";
import { ListTagsService } from "./application/use-cases/ListTagsService.ts";
import { TagController } from "./infrastructure/http/controllers/TagController.ts";
import { PrismaTagRepository } from "./infrastructure/persistence/prisma/PrismaTagRepository.ts";

@Module({
  controllers: [TagController],
  providers: [
    CreateTagService,
    ListTagsService,
    {
      provide: TAG_REPOSITORY,
      useClass: PrismaTagRepository
    }
  ],
  exports: [CreateTagService, ListTagsService]
})
export class TagModule {}


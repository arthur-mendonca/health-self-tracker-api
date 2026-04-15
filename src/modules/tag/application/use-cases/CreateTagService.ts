import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Tag } from "../../domain/entities/Tag.ts";
import type { CreateTagCommand, CreateTagUseCase } from "../ports/in/CreateTagUseCase.ts";
import { TAG_REPOSITORY } from "../ports/out/TagRepositoryPort.ts";
import type { TagRepositoryPort } from "../ports/out/TagRepositoryPort.ts";

@Injectable()
export class CreateTagService implements CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepositoryPort
  ) {}

  async execute(command: CreateTagCommand): Promise<Tag> {
    const tag = Tag.create(command.name, command.category ?? "GENERAL");
    return await this.tagRepository.create(tag);
  }
}

import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import type { Tag } from "../../domain/entities/Tag.ts";
import type { UpdateTagCommand, UpdateTagUseCase } from "../ports/in/UpdateTagUseCase.ts";
import { TAG_REPOSITORY } from "../ports/out/TagRepositoryPort.ts";
import type { TagRepositoryPort } from "../ports/out/TagRepositoryPort.ts";

@Injectable()
export class UpdateTagService implements UpdateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepositoryPort
  ) {}

  async execute(command: UpdateTagCommand): Promise<Tag | null> {
    if (command.name === undefined && command.category === undefined) {
      throw new Error("At least one tag field must be provided.");
    }

    const name = command.name?.trim();

    if (command.name !== undefined && !name) {
      throw new Error("Tag name is required.");
    }

    return await this.tagRepository.update(command.id, {
      name,
      category: command.category
    });
  }
}

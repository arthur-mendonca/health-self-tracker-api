import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import { Tag } from "../../domain/entities/Tag.ts";
import type { ListTagsUseCase } from "../ports/in/ListTagsUseCase.ts";
import { TAG_REPOSITORY } from "../ports/out/TagRepositoryPort.ts";
import type { TagRepositoryPort } from "../ports/out/TagRepositoryPort.ts";

@Injectable()
export class ListTagsService implements ListTagsUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepositoryPort
  ) {}

  async execute(): Promise<Tag[]> {
    return await this.tagRepository.list();
  }
}

import { Inject, Injectable } from "npm:@nestjs/common@10.4.15";

import type { DeleteTagUseCase } from "../ports/in/DeleteTagUseCase.ts";
import { TAG_REPOSITORY } from "../ports/out/TagRepositoryPort.ts";
import type { TagRepositoryPort } from "../ports/out/TagRepositoryPort.ts";

@Injectable()
export class DeleteTagService implements DeleteTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepositoryPort
  ) {}

  async execute(id: string): Promise<boolean> {
    return await this.tagRepository.delete(id);
  }
}

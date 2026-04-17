import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post
} from "npm:@nestjs/common@10.4.15";

import { CreateTagService } from "../../../application/use-cases/CreateTagService.ts";
import { DeleteTagService } from "../../../application/use-cases/DeleteTagService.ts";
import { ListTagsService } from "../../../application/use-cases/ListTagsService.ts";
import { UpdateTagService } from "../../../application/use-cases/UpdateTagService.ts";
import { Tag } from "../../../domain/entities/Tag.ts";
import { CreateTagDto } from "../dtos/CreateTagDto.ts";
import { UpdateTagDto } from "../dtos/UpdateTagDto.ts";
import { rethrowAsHttpError } from "../../../../../shared/infrastructure/http/domain-error.ts";

@Controller("tags")
export class TagController {
  constructor(
    private readonly createTagService: CreateTagService,
    private readonly listTagsService: ListTagsService,
    private readonly updateTagService: UpdateTagService,
    private readonly deleteTagService: DeleteTagService
  ) {}

  @Get()
  async list() {
    const tags = await this.listTagsService.execute();
    return tags.map(toResponse);
  }

  @Post()
  async create(@Body() body: CreateTagDto) {
    try {
      const tag = await this.createTagService.execute(body);
      return toResponse(tag);
    } catch (error) {
      rethrowAsHttpError(error, "Invalid tag payload.");
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateTagDto) {
    try {
      const tag = await this.updateTagService.execute({
        id,
        ...body
      });

      if (!tag) {
        throw new NotFoundException("Tag not found.");
      }

      return toResponse(tag);
    } catch (error) {
      rethrowAsHttpError(error, "Invalid tag payload.");
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string) {
    const deleted = await this.deleteTagService.execute(id);

    if (!deleted) {
      throw new NotFoundException("Tag not found.");
    }
  }
}

function toResponse(tag: Tag) {
  return {
    id: tag.id,
    name: tag.name,
    category: tag.category,
    createdAt: tag.createdAt?.toISOString()
  };
}

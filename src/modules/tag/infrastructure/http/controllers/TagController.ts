import { BadRequestException, Body, Controller, Get, Post } from "npm:@nestjs/common@10.4.15";

import { CreateTagService } from "../../../application/use-cases/CreateTagService.ts";
import { ListTagsService } from "../../../application/use-cases/ListTagsService.ts";
import { isTagCategory, Tag } from "../../../domain/entities/Tag.ts";
import type { CreateTagDto } from "../dtos/CreateTagDto.ts";

@Controller("tags")
export class TagController {
  constructor(
    private readonly createTagService: CreateTagService,
    private readonly listTagsService: ListTagsService
  ) {}

  @Get()
  async list() {
    const tags = await this.listTagsService.execute();
    return tags.map(toResponse);
  }

  @Post()
  async create(@Body() body: CreateTagDto) {
    if (body.category !== undefined && !isTagCategory(body.category)) {
      throw new BadRequestException("category is invalid.");
    }

    try {
      const tag = await this.createTagService.execute(body);
      return toResponse(tag);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid tag payload.");
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

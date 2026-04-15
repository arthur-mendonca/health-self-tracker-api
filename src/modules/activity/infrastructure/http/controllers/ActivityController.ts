import { BadRequestException, Body, Controller, Get, Post } from "npm:@nestjs/common@10.4.15";

import { CreateActivityService } from "../../../application/use-cases/CreateActivityService.ts";
import { ListActivitiesService } from "../../../application/use-cases/ListActivitiesService.ts";
import { Activity } from "../../../domain/entities/Activity.ts";
import { CreateActivityDto } from "../dtos/CreateActivityDto.ts";

@Controller("activities")
export class ActivityController {
  constructor(
    private readonly createActivityService: CreateActivityService,
    private readonly listActivitiesService: ListActivitiesService
  ) {}

  @Get()
  async list() {
    const activities = await this.listActivitiesService.execute();
    return activities.map(toResponse);
  }

  @Post()
  async create(@Body() body: CreateActivityDto) {
    try {
      const activity = await this.createActivityService.execute(body);
      return toResponse(activity);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid activity payload.");
    }
  }
}

function toResponse(activity: Activity) {
  return {
    id: activity.id,
    name: activity.name
  };
}

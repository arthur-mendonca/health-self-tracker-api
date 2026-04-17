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

import { CreateActivityService } from "../../../application/use-cases/CreateActivityService.ts";
import { DeleteActivityService } from "../../../application/use-cases/DeleteActivityService.ts";
import { ListActivitiesService } from "../../../application/use-cases/ListActivitiesService.ts";
import { UpdateActivityService } from "../../../application/use-cases/UpdateActivityService.ts";
import { Activity } from "../../../domain/entities/Activity.ts";
import { CreateActivityDto } from "../dtos/CreateActivityDto.ts";
import { UpdateActivityDto } from "../dtos/UpdateActivityDto.ts";
import { rethrowAsHttpError } from "../../../../../shared/infrastructure/http/domain-error.ts";

@Controller("activities")
export class ActivityController {
  constructor(
    private readonly createActivityService: CreateActivityService,
    private readonly listActivitiesService: ListActivitiesService,
    private readonly updateActivityService: UpdateActivityService,
    private readonly deleteActivityService: DeleteActivityService
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
      rethrowAsHttpError(error, "Invalid activity payload.");
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateActivityDto) {
    try {
      const activity = await this.updateActivityService.execute({
        id,
        ...body
      });

      if (!activity) {
        throw new NotFoundException("Activity not found.");
      }

      return toResponse(activity);
    } catch (error) {
      rethrowAsHttpError(error, "Invalid activity payload.");
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string) {
    const deleted = await this.deleteActivityService.execute(id);

    if (!deleted) {
      throw new NotFoundException("Activity not found.");
    }
  }
}

function toResponse(activity: Activity) {
  return {
    id: activity.id,
    name: activity.name
  };
}

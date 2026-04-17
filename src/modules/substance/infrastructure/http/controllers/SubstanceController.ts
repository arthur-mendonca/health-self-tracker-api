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

import { CreateSubstanceService } from "../../../application/use-cases/CreateSubstanceService.ts";
import { DeleteSubstanceService } from "../../../application/use-cases/DeleteSubstanceService.ts";
import { ListSubstancesService } from "../../../application/use-cases/ListSubstancesService.ts";
import { UpdateSubstanceService } from "../../../application/use-cases/UpdateSubstanceService.ts";
import { Substance } from "../../../domain/entities/Substance.ts";
import { CreateSubstanceDto } from "../dtos/CreateSubstanceDto.ts";
import { UpdateSubstanceDto } from "../dtos/UpdateSubstanceDto.ts";
import { rethrowAsHttpError } from "../../../../../shared/infrastructure/http/domain-error.ts";

@Controller("substances")
export class SubstanceController {
  constructor(
    private readonly createSubstanceService: CreateSubstanceService,
    private readonly listSubstancesService: ListSubstancesService,
    private readonly updateSubstanceService: UpdateSubstanceService,
    private readonly deleteSubstanceService: DeleteSubstanceService
  ) {}

  @Get()
  async list() {
    const substances = await this.listSubstancesService.execute();
    return substances.map(toResponse);
  }

  @Post()
  async create(@Body() body: CreateSubstanceDto) {
    try {
      const substance = await this.createSubstanceService.execute(body);
      return toResponse(substance);
    } catch (error) {
      rethrowAsHttpError(error, "Invalid substance payload.");
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateSubstanceDto) {
    try {
      const substance = await this.updateSubstanceService.execute({
        id,
        ...body
      });

      if (!substance) {
        throw new NotFoundException("Substance not found.");
      }

      return toResponse(substance);
    } catch (error) {
      rethrowAsHttpError(error, "Invalid substance payload.");
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string) {
    const deleted = await this.deleteSubstanceService.execute(id);

    if (!deleted) {
      throw new NotFoundException("Substance not found.");
    }
  }
}

function toResponse(substance: Substance) {
  return {
    id: substance.id,
    name: substance.name,
    type: substance.type,
    defaultDose: substance.defaultDose
  };
}

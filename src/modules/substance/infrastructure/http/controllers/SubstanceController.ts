import { BadRequestException, Body, Controller, Get, Post } from "npm:@nestjs/common@10.4.15";

import { CreateSubstanceService } from "../../../application/use-cases/CreateSubstanceService.ts";
import { ListSubstancesService } from "../../../application/use-cases/ListSubstancesService.ts";
import { Substance } from "../../../domain/entities/Substance.ts";
import { CreateSubstanceDto } from "../dtos/CreateSubstanceDto.ts";

@Controller("substances")
export class SubstanceController {
  constructor(
    private readonly createSubstanceService: CreateSubstanceService,
    private readonly listSubstancesService: ListSubstancesService
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
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid substance payload.");
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

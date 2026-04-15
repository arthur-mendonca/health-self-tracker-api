import { Controller, Get } from "npm:@nestjs/common@10.4.15";

import { ExportDumpService } from "../../../application/use-cases/ExportDumpService.ts";

@Controller("export")
export class ExportController {
  constructor(private readonly exportDumpService: ExportDumpService) {}

  @Get("dump")
  async dump() {
    return await this.exportDumpService.execute();
  }
}


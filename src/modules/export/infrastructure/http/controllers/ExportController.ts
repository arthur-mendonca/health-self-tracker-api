import { Controller, Get, Res } from "npm:@nestjs/common@10.4.15";

import { ExportDumpService } from "../../../application/use-cases/ExportDumpService.ts";

@Controller("export")
export class ExportController {
  constructor(private readonly exportDumpService: ExportDumpService) {}

  @Get("dump")
  async dump() {
    return await this.exportDumpService.execute();
  }

  @Get("dump.csv")
  async dumpCsv(@Res() response: ResponseLike) {
    const csv = await this.exportDumpService.executeCsv();

    response.setHeader("content-type", "text/csv; charset=utf-8");
    response.setHeader("content-disposition", "attachment; filename=\"health-self-tracker-dump.csv\"");
    response.send(csv);
  }
}

type ResponseLike = {
  setHeader(name: string, value: string): void;
  send(body: string): void;
};

import { Buffer } from "node:buffer";

import { BadRequestException, Controller, Get, Query, Res } from "npm:@nestjs/common@10.4.15";

import type { ExportDumpQuery } from "../../../application/ports/in/ExportDumpUseCase.ts";
import { ExportDumpService } from "../../../application/use-cases/ExportDumpService.ts";

@Controller("export")
export class ExportController {
  constructor(private readonly exportDumpService: ExportDumpService) {}

  @Get("dump")
  async dump(@Query() query: ExportDumpQuery) {
    try {
      return await this.exportDumpService.execute(query);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid export query.");
    }
  }

  @Get("dump.json")
  async dumpJson(@Query() query: ExportDumpQuery, @Res() response: ResponseLike) {
    try {
      const dump = await this.exportDumpService.execute(query);
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.setHeader("content-disposition", "attachment; filename=\"health-self-tracker-dump.json\"");
      response.send(JSON.stringify(dump, null, 2));
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid export query.");
    }
  }

  @Get("dump.csv")
  async dumpCsv(@Query() query: ExportDumpQuery, @Res() response: ResponseLike) {
    try {
      const csv = await this.exportDumpService.executeCsv(query);

      response.setHeader("content-type", "text/csv; charset=utf-8");
      response.setHeader("content-disposition", "attachment; filename=\"health-self-tracker-dump.csv\"");
      response.send(csv);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid export query.");
    }
  }

  @Get("dump.txt")
  async dumpTxt(@Query() query: ExportDumpQuery, @Res() response: ResponseLike) {
    try {
      const text = await this.exportDumpService.executeTxt(query);

      response.setHeader("content-type", "text/plain; charset=utf-8");
      response.setHeader("content-disposition", "attachment; filename=\"health-self-tracker-dump.txt\"");
      response.send(text);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid export query.");
    }
  }

  @Get("dump.pdf")
  async dumpPdf(@Query() query: ExportDumpQuery, @Res() response: ResponseLike) {
    try {
      const pdf = await this.exportDumpService.executePdf(query);

      response.setHeader("content-type", "application/pdf");
      response.setHeader("content-disposition", "attachment; filename=\"health-self-tracker-dump.pdf\"");
      response.send(Buffer.from(pdf));
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid export query.");
    }
  }
}

type ResponseLike = {
  setHeader(name: string, value: string): void;
  send(body: string | Buffer): void;
};

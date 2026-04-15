export type ExportDumpQuery = {
  startDate?: string;
  endDate?: string;
  days?: string;
};

export type ExportDump = {
  generatedAt: string;
  period: {
    startDate?: string;
    endDate?: string;
  };
  records: unknown[];
};

export interface ExportDumpUseCase {
  execute(query?: ExportDumpQuery): Promise<ExportDump>;
}

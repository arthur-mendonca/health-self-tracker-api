export type ExportDump = {
  generatedAt: string;
  records: unknown[];
};

export interface ExportDumpUseCase {
  execute(): Promise<ExportDump>;
}


export interface DeleteSubstanceUseCase {
  execute(id: string): Promise<boolean>;
}

export interface DeleteActivityUseCase {
  execute(id: string): Promise<boolean>;
}

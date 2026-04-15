export interface DeleteTagUseCase {
  execute(id: string): Promise<boolean>;
}

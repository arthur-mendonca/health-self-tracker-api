import type { Substance, SubstanceType } from "../../../domain/entities/Substance.ts";

export type CreateSubstanceCommand = {
  name: string;
  type: SubstanceType;
  defaultDose?: string | null;
};

export interface CreateSubstanceUseCase {
  execute(command: CreateSubstanceCommand): Promise<Substance>;
}

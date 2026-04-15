import type { Substance, SubstanceType } from "../../../domain/entities/Substance.ts";

export type UpdateSubstanceCommand = {
  id: string;
  name?: string;
  type?: SubstanceType;
  defaultDose?: string | null;
};

export interface UpdateSubstanceUseCase {
  execute(command: UpdateSubstanceCommand): Promise<Substance | null>;
}

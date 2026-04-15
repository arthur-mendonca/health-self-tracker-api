import type { Substance, SubstanceType } from "../../../domain/entities/Substance.ts";

export const SUBSTANCE_REPOSITORY = "SubstanceRepositoryPort";

export type UpdateSubstanceData = {
  name?: string;
  type?: SubstanceType;
  defaultDose?: string | null;
};

export interface SubstanceRepositoryPort {
  create(substance: Substance): Promise<Substance>;
  list(): Promise<Substance[]>;
  update(id: string, data: UpdateSubstanceData): Promise<Substance | null>;
  delete(id: string): Promise<boolean>;
}

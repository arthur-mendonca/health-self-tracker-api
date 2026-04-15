import type { SubstanceType } from "../../../domain/entities/Substance.ts";

export type CreateSubstanceDto = {
  name: string;
  type: SubstanceType;
  defaultDose?: string | null;
};

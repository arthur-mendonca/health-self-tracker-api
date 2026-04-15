import type { Substance } from "../../../domain/entities/Substance.ts";

export const SUBSTANCE_REPOSITORY = "SubstanceRepositoryPort";

export interface SubstanceRepositoryPort {
  create(substance: Substance): Promise<Substance>;
  list(): Promise<Substance[]>;
}

import type { Substance } from "../../../domain/entities/Substance.ts";

export interface ListSubstancesUseCase {
  execute(): Promise<Substance[]>;
}

import { Substance } from "../../../domain/entities/Substance.ts";
import type { SubstanceType } from "../../../domain/entities/Substance.ts";

export class SubstancePrismaMapper {
  static toDomain(model: { id: string; name: string; type: SubstanceType; defaultDose?: string | null }): Substance {
    return Substance.rehydrate({
      id: model.id,
      name: model.name,
      type: model.type,
      defaultDose: model.defaultDose
    });
  }
}

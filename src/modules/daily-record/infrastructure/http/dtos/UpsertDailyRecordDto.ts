import type { SubstanceType } from "../../../../substance/domain/entities/Substance.ts";
import type { TagCategory } from "../../../../tag/domain/entities/Tag.ts";
import type { JsonObject } from "../../../../../shared/domain/types/json-value.ts";
import type { DropTime } from "../../../domain/entities/DailyRecord.ts";

export type UpsertDailyRecordDto = {
  date?: string;
  metrics?: JsonObject | null;
  structuredNotes?: JsonObject | null;
  tags?: Array<{
    name: string;
    category?: TagCategory;
  }>;
  substances?: Array<{
    name: string;
    type: SubstanceType;
    defaultDose?: string | null;
    exactDose: string;
    notes?: string | null;
    effectDropTime?: DropTime | null;
    experiencedCrash?: boolean;
  }>;
  activities?: Array<{
    name: string;
    notes?: string | null;
  }>;
};

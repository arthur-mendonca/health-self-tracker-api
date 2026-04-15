import { ulid } from "npm:ulid@3.0.1";

export type SubstanceType = "MEDICATION" | "SUPPLEMENT";

export const substanceTypes = ["MEDICATION", "SUPPLEMENT"] as const;

type SubstanceProps = {
  id: string;
  name: string;
  type: SubstanceType;
  defaultDose?: string | null;
};

export class Substance {
  readonly id: string;
  readonly name: string;
  readonly type: SubstanceType;
  readonly defaultDose?: string | null;

  private constructor(props: SubstanceProps) {
    const name = props.name.trim();

    if (!name) {
      throw new Error("Substance name is required.");
    }

    this.id = props.id;
    this.name = name;
    this.type = props.type;
    this.defaultDose = props.defaultDose?.trim() || null;
  }

  static create(name: string, type: SubstanceType, defaultDose?: string | null): Substance {
    return new Substance({
      id: ulid(),
      name,
      type,
      defaultDose
    });
  }

  static rehydrate(props: SubstanceProps): Substance {
    return new Substance(props);
  }
}

export function isSubstanceType(value: unknown): value is SubstanceType {
  return substanceTypes.includes(value as SubstanceType);
}

import { ulid } from "npm:ulid@3.0.1";

import { Activity } from "../../../activity/domain/entities/Activity.ts";
import { Substance } from "../../../substance/domain/entities/Substance.ts";
import { Tag } from "../../../tag/domain/entities/Tag.ts";
import type { JsonObject } from "../../../../shared/domain/types/json-value.ts";
import { toDateOnly } from "../../../../shared/utils/date.ts";

export type DropTime = "MORNING" | "AFTERNOON" | "EVENING" | "NONE";

export type DailySubstanceLogProps = {
  id: string;
  substance: Substance;
  exactDose: string;
  notes?: string | null;
  effectDropTime?: DropTime | null;
  experiencedCrash: boolean;
};

export type DailyActivityLogProps = {
  id: string;
  activity: Activity;
  notes?: string | null;
};

type DailyRecordProps = {
  id: string;
  date: Date;
  metrics?: JsonObject | null;
  structuredNotes?: JsonObject | null;
  tags: Tag[];
  substances: DailySubstanceLogProps[];
  activities: DailyActivityLogProps[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class DailyRecord {
  readonly id: string;
  readonly date: Date;
  readonly metrics: JsonObject | null;
  readonly structuredNotes: JsonObject | null;
  readonly tags: Tag[];
  readonly substances: DailySubstanceLogProps[];
  readonly activities: DailyActivityLogProps[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: DailyRecordProps) {
    this.id = props.id;
    this.date = toDateOnly(props.date);
    this.metrics = props.metrics ?? null;
    this.structuredNotes = props.structuredNotes ?? null;
    this.tags = props.tags;
    this.substances = props.substances;
    this.activities = props.activities;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<DailyRecordProps, "id">): DailyRecord {
    return new DailyRecord({
      ...props,
      id: ulid(),
      substances: props.substances.map((log) => ({
        ...log,
        id: log.id || ulid()
      })),
      activities: props.activities.map((log) => ({
        ...log,
        id: log.id || ulid()
      }))
    });
  }

  static rehydrate(props: DailyRecordProps): DailyRecord {
    return new DailyRecord(props);
  }
}

export function createDailySubstanceLog(props: Omit<DailySubstanceLogProps, "id">): DailySubstanceLogProps {
  if (!props.exactDose.trim()) {
    throw new Error("exactDose is required for substances.");
  }

  return {
    id: ulid(),
    substance: props.substance,
    exactDose: props.exactDose.trim(),
    notes: props.notes?.trim() || null,
    effectDropTime: props.effectDropTime ?? null,
    experiencedCrash: props.experiencedCrash
  };
}

export function createDailyActivityLog(props: Omit<DailyActivityLogProps, "id">): DailyActivityLogProps {
  return {
    id: ulid(),
    activity: props.activity,
    notes: props.notes?.trim() || null
  };
}

export function isDropTime(value: unknown): value is DropTime {
  return value === "MORNING" || value === "AFTERNOON" || value === "EVENING" || value === "NONE";
}

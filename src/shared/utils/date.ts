const saoPauloTimeZone = "America/Sao_Paulo";

export function parseDateOnly(value?: string): Date {
  if (!value) {
    return toDateOnly(new Date());
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("date must use YYYY-MM-DD format.");
  }

  return new Date(`${value}T00:00:00.000Z`);
}

export function toDateOnly(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export function todayDateOnlyInSaoPaulo(now = new Date()): Date {
  return dateOnlyInTimeZone(now, saoPauloTimeZone);
}

export function dateOnlyInTimeZone(value: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric"
  }).formatToParts(value);

  const partByType = new Map(parts.map((part) => [part.type, part.value]));
  const year = Number(partByType.get("year"));
  const month = Number(partByType.get("month"));
  const day = Number(partByType.get("day"));

  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

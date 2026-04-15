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

export function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}


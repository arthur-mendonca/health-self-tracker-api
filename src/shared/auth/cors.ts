const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5173",
  "https://health-front.gestorinvest.xyz",
];

export function getAllowedCorsOrigins(): string[] {
  return parseCsv(Deno.env.get("CORS_ORIGINS")) ?? defaultCorsOrigins;
}

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return false;
  }

  return getAllowedCorsOrigins().includes(origin);
}

export function isCorsOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  return isAllowedOrigin(origin);
}

function parseCsv(value: string | undefined): string[] | null {
  const values = value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return values?.length ? values : null;
}

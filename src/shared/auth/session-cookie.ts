export type SameSite = "lax" | "none" | "strict";

export type SessionCookieConfig = {
  domain?: string;
  maxAgeSeconds: number;
  name: string;
  sameSite: SameSite;
  secure: boolean;
};

export function getSessionCookieConfig(): SessionCookieConfig {
  return {
    domain: emptyToUndefined(Deno.env.get("AUTH_COOKIE_DOMAIN")?.trim()),
    maxAgeSeconds: getMaxAgeSeconds(),
    name: Deno.env.get("AUTH_COOKIE_NAME")?.trim() || "health_self_tracker_session",
    sameSite: getSameSite(Deno.env.get("AUTH_COOKIE_SAME_SITE")),
    secure: getSecureCookieDefault(),
  };
}

export function serializeSessionCookie(token: string, config = getSessionCookieConfig()): string {
  return serializeCookie(config.name, token, {
    domain: config.domain,
    httpOnly: true,
    maxAge: config.maxAgeSeconds,
    path: "/",
    sameSite: config.sameSite,
    secure: config.secure,
  });
}

export function serializeClearSessionCookie(config = getSessionCookieConfig()): string {
  return serializeCookie(config.name, "", {
    domain: config.domain,
    expires: new Date(0),
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: config.sameSite,
    secure: config.secure,
  });
}

export function getSessionTokenFromCookieHeader(
  cookieHeader: string | undefined,
  config = getSessionCookieConfig(),
): string | null {
  return parseCookies(cookieHeader)[config.name] ?? null;
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValueParts] = part.split("=");
    const name = rawName.trim();

    if (!name) {
      continue;
    }

    cookies[name] = safeDecodeURIComponent(rawValueParts.join("=").trim());
  }

  return cookies;
}

function serializeCookie(
  name: string,
  value: string,
  options: {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: SameSite;
    secure?: boolean;
  },
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.trunc(options.maxAge)}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (options.secure) {
    parts.push("Secure");
  }

  if (options.sameSite) {
    parts.push(`SameSite=${capitalize(options.sameSite)}`);
  }

  return parts.join("; ");
}

function getSameSite(value: string | undefined): SameSite {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "strict" || normalized === "none" || normalized === "lax") {
    return normalized;
  }

  return Deno.env.get("AUTH_COOKIE_DOMAIN") ? "none" : "lax";
}

function getMaxAgeSeconds(): number {
  const value = Number(Deno.env.get("AUTH_COOKIE_MAX_AGE_SECONDS") ?? 60 * 60);

  return Number.isFinite(value) && value > 0 ? value : 60 * 60;
}

function getSecureCookieDefault(): boolean {
  const value = Deno.env.get("AUTH_COOKIE_SECURE")?.trim().toLowerCase();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return Boolean(Deno.env.get("AUTH_COOKIE_DOMAIN"));
}

function capitalize(value: SameSite): string {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function emptyToUndefined(value: string | undefined): string | undefined {
  return value || undefined;
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export type JwtPayload = {
  sub: string;
  email: string;
  exp: number;
  purpose: "api_access";
};

const encoder = new TextEncoder();

export async function signJwt(payload: JwtPayload, secret: string): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const unsignedToken = `${base64UrlEncodeJson(header)}.${base64UrlEncodeJson(payload)}`;
  const signature = await hmacSha256(unsignedToken, secret);
  return `${unsignedToken}.${base64UrlEncodeBytes(signature)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error("Invalid token.");
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = base64UrlEncodeBytes(await hmacSha256(unsignedToken, secret));

  if (expectedSignature !== encodedSignature) {
    throw new Error("Invalid token signature.");
  }

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as JwtPayload;

  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired.");
  }

  return payload;
}

function base64UrlEncodeJson(value: unknown): string {
  return base64UrlEncodeBytes(encoder.encode(JSON.stringify(value)));
}

function base64UrlEncodeBytes(value: Uint8Array): string {
  return btoa(String.fromCharCode(...value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function hmacSha256(value: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      hash: "SHA-256",
      name: "HMAC"
    },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return new Uint8Array(signature);
}

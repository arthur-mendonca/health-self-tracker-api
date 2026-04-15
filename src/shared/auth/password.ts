const encoder = new TextEncoder();

export async function hashPassword(password: string, salt = generateSalt()): Promise<{ hash: string; salt: string }> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      hash: "SHA-256",
      iterations: 120_000,
      name: "PBKDF2",
      salt: encoder.encode(salt)
    },
    key,
    256
  );

  return {
    hash: toHex(new Uint8Array(derivedBits)),
    salt
  };
}

export async function verifyPassword(password: string, expectedHash: string, salt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === expectedHash;
}

function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

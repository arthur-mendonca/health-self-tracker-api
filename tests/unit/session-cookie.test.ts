import assert from "node:assert/strict";

import {
  getSessionTokenFromCookieHeader,
  parseCookies,
  serializeClearSessionCookie,
  serializeSessionCookie,
  type SessionCookieConfig,
} from "../../src/shared/auth/session-cookie.ts";

const productionConfig: SessionCookieConfig = {
  domain: ".gestorinvest.xyz",
  maxAgeSeconds: 3600,
  name: "health_self_tracker_session",
  sameSite: "none",
  secure: true,
};

Deno.test("serializeSessionCookie builds the login cookie with production attributes", () => {
  const cookie = serializeSessionCookie("jwt.token.value", productionConfig);

  assert.equal(
    cookie,
    "health_self_tracker_session=jwt.token.value; Max-Age=3600; Domain=.gestorinvest.xyz; Path=/; HttpOnly; Secure; SameSite=None",
  );
});

Deno.test("serializeClearSessionCookie builds an expired clearing cookie", () => {
  const cookie = serializeClearSessionCookie(productionConfig);

  assert.ok(cookie.startsWith("health_self_tracker_session=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"));
  assert.ok(cookie.includes("Domain=.gestorinvest.xyz"));
  assert.ok(cookie.includes("HttpOnly"));
  assert.ok(cookie.includes("Secure"));
  assert.ok(cookie.includes("SameSite=None"));
});

Deno.test("parseCookies and getSessionTokenFromCookieHeader read the configured cookie", () => {
  const cookieHeader = "theme=dark; health_self_tracker_session=jwt.token.value; other=value";

  assert.deepEqual(parseCookies(cookieHeader), {
    health_self_tracker_session: "jwt.token.value",
    other: "value",
    theme: "dark",
  });
  assert.equal(getSessionTokenFromCookieHeader(cookieHeader, productionConfig), "jwt.token.value");
});

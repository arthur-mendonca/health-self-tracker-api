import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "npm:@nestjs/common@10.4.15";
import { Reflector } from "npm:@nestjs/core@10.4.15";

import type { AuthenticatedUser } from "./authenticated-user.ts";
import { isAllowedOrigin } from "./cors.ts";
import { IS_PUBLIC_ROUTE } from "./public.ts";
import { getSessionTokenFromCookieHeader } from "./session-cookie.ts";
import { verifyJwt } from "./jwt.ts";

type RequestLike = {
  headers: {
    authorization?: string;
    cookie?: string;
    origin?: string;
  };
  method?: string;
  user?: AuthenticatedUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestLike>();
    const auth = getAuthToken(request.headers.authorization, request.headers.cookie);

    if (!auth) {
      throw new UnauthorizedException("Authorization bearer token or session cookie is required.");
    }

    if (auth.source === "cookie" && isUnsafeMethod(request.method) && !isAllowedOrigin(request.headers.origin)) {
      throw new ForbiddenException("Cookie-authenticated write requests require an allowed Origin header.");
    }

    try {
      const payload = await verifyJwt(auth.token, getJwtSecret());

      if (payload.purpose !== "api_access") {
        throw new Error("Token is not valid for API access.");
      }

      request.user = {
        id: payload.sub,
        email: payload.email
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired authorization token.");
    }
  }
}

type AuthToken = {
  source: "bearer" | "cookie";
  token: string;
};

export function getAuthToken(authorization?: string, cookie?: string): AuthToken | null {
  const bearerToken = getBearerToken(authorization);

  if (bearerToken) {
    return {
      source: "bearer",
      token: bearerToken
    };
  }

  const cookieToken = getSessionTokenFromCookieHeader(cookie);

  return cookieToken
    ? {
      source: "cookie",
      token: cookieToken
    }
    : null;
}

export function getBearerToken(value?: string): string | null {
  if (!value?.startsWith("Bearer ")) {
    return null;
  }

  return value.slice("Bearer ".length).trim() || null;
}

export function getJwtSecret(): string {
  const secret = Deno.env.get("JWT_SECRET");

  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }

  return secret;
}

function isUnsafeMethod(method: string | undefined): boolean {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "npm:@nestjs/common@10.4.15";
import { Reflector } from "npm:@nestjs/core@10.4.15";

import type { AuthenticatedUser } from "./authenticated-user.ts";
import { IS_PUBLIC_ROUTE } from "./public.ts";
import { verifyJwt } from "./jwt.ts";

type RequestLike = {
  headers: {
    authorization?: string;
  };
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
    const token = getBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException("Authorization bearer token is required.");
    }

    try {
      const payload = await verifyJwt(token, getJwtSecret());

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

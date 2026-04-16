import { Logger } from "npm:@nestjs/common@10.4.15";

type HeaderValue = string | string[] | undefined;

type RequestLike = {
  headers: Record<string, HeaderValue>;
  ip?: string;
  method?: string;
  originalUrl?: string;
  requestId?: string;
  url?: string;
};

type ResponseLike = {
  once(event: "finish", listener: () => void): void;
  setHeader(name: string, value: string): void;
  statusCode: number;
};

type NextFunction = () => void;

const logger = new Logger("HttpRequest");

export function requestLoggingMiddleware(
  request: RequestLike,
  response: ResponseLike,
  next: NextFunction,
): void {
  const requestId = getFirstHeader(request.headers["x-request-id"]) ?? crypto.randomUUID();
  const startedAt = performance.now();

  request.requestId = requestId;
  response.setHeader("X-Request-Id", requestId);

  response.once("finish", () => {
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    const statusCode = response.statusCode;
    const payload = {
      auth: request.headers.authorization ? "present" : "missing",
      durationMs,
      ip: getFirstHeader(request.headers["x-forwarded-for"]) ?? request.ip,
      method: request.method,
      origin: getFirstHeader(request.headers.origin),
      path: request.originalUrl ?? request.url,
      requestId,
      statusCode,
      userAgent: getFirstHeader(request.headers["user-agent"]),
    };
    const message = JSON.stringify(payload);

    if (statusCode >= 500) {
      logger.error(message);
      return;
    }

    if (statusCode >= 400) {
      logger.warn(message);
      return;
    }

    logger.log(message);
  });

  next();
}

function getFirstHeader(value: HeaderValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "npm:@nestjs/common@10.4.15";

type RequestLike = {
  method?: string;
  originalUrl?: string;
  requestId?: string;
  url?: string;
};

type ResponseLike = {
  status(statusCode: number): {
    json(body: unknown): void;
  };
};

type ErrorResponseBody = {
  error: string;
  message: string | string[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestLike>();
    const response = context.getResponse<ResponseLike>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = normalizeErrorResponse(exception, statusCode);
    const requestId = request.requestId ?? crypto.randomUUID();
    const responseBody = {
      ...errorResponse,
      method: request.method,
      path: request.originalUrl ?? request.url,
      requestId,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    const logBody = {
      ...responseBody,
      cause: summarizeException(exception),
      exceptionName:
        exception instanceof Error ? exception.name : typeof exception,
    };

    if (statusCode >= 500) {
      this.logger.error(
        JSON.stringify(logBody),
        exception instanceof Error ? sanitizeForLog(exception.stack) : undefined,
      );
    } else {
      this.logger.warn(JSON.stringify(logBody));
    }

    response.status(statusCode).json(responseBody);
  }
}

function normalizeErrorResponse(
  exception: unknown,
  statusCode: number,
): ErrorResponseBody {
  if (exception instanceof HttpException) {
    const response = exception.getResponse();

    if (typeof response === "string") {
      return {
        error: exception.name,
        message: response,
      };
    }

    if (isErrorResponseObject(response)) {
      return {
        error: response.error ?? exception.name,
        message: response.message ?? exception.message,
      };
    }

    return {
      error: exception.name,
      message: exception.message,
    };
  }

  if (exception instanceof Error) {
    const infrastructureError = classifyInfrastructureError(exception);

    if (infrastructureError) {
      return infrastructureError;
    }

    return {
      error:
        statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? "Internal Server Error"
          : exception.name,
      message:
        statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? "An unexpected error occurred."
          : exception.message,
    };
  }

  return {
    error: "Internal Server Error",
    message: "An unexpected error occurred.",
  };
}

function isErrorResponseObject(
  value: unknown,
): value is Partial<ErrorResponseBody> {
  return typeof value === "object" && value !== null;
}

function classifyInfrastructureError(error: Error): ErrorResponseBody | null {
  const message = error.message;

  if (message.includes("Authentication failed against the database server")) {
    return {
      error: "Database Authentication Error",
      message:
        "Database authentication failed for the configured user. Check DATABASE_URL and POSTGRES credentials on the server.",
    };
  }

  if (
    message.includes("Can't reach database server") ||
    message.includes("Timed out fetching a new connection") ||
    message.includes("Connection terminated") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ENOTFOUND")
  ) {
    return {
      error: "Database Connection Error",
      message:
        "The API could not connect to the database. Check database host, port, credentials, and container/network health.",
    };
  }

  return null;
}

function summarizeException(exception: unknown): string {
  if (exception instanceof Error) {
    return sanitizeForLog(exception.message);
  }

  if (typeof exception === "string") {
    return sanitizeForLog(exception);
  }

  return typeof exception;
}

function sanitizeForLog(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/postgres(?:ql)?:\/\/[^@\s]+@/gi, "postgresql://[redacted]@")
    .replace(/(password|token|secret|cookie)=([^&\s]+)/gi, "$1=[redacted]")
    .replace(/(password|token|secret|cookie)["']?\s*:\s*["'][^"']+["']/gi, "$1: [redacted]");
}

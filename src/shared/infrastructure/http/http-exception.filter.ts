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
      exceptionName:
        exception instanceof Error ? exception.name : typeof exception,
    };

    if (statusCode >= 500) {
      this.logger.error(
        JSON.stringify(logBody),
        exception instanceof Error ? exception.stack : undefined,
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

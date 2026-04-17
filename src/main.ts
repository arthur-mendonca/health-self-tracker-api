import "npm:reflect-metadata";

import { ValidationPipe } from "npm:@nestjs/common@10.4.15";
import { NestFactory } from "npm:@nestjs/core@10.4.15";

import { AppModule } from "./app.module.ts";
import { isCorsOriginAllowed } from "./shared/auth/cors.ts";
import { HttpExceptionFilter } from "./shared/infrastructure/http/http-exception.filter.ts";
import { requestLoggingMiddleware } from "./shared/infrastructure/http/request-logging.middleware.ts";

const app = await NestFactory.create(AppModule);

const httpAdapterInstance = app.getHttpAdapter().getInstance() as {
  disable?: (setting: string) => void;
  set?: (setting: string, value: unknown) => void;
};
httpAdapterInstance.disable?.("etag");
httpAdapterInstance.set?.("etag", false);

app.enableCors({
  allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
  credentials: true,
  exposedHeaders: ["X-Request-Id", "X-App-Instance-Id"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  origin: (origin, callback) => {
    callback(null, isCorsOriginAllowed(origin));
  },
});
app.use((_request: unknown, response: ResponseLike, next: NextFunctionLike) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");
  next();
});
app.use(requestLoggingMiddleware);
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalPipes(
  new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true
  })
);

const port = Number(Deno.env.get("PORT") ?? 3000);
await app.listen(port);

type ResponseLike = {
  setHeader(name: string, value: string): void;
};

type NextFunctionLike = () => void;

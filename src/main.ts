import "npm:reflect-metadata";

import { ValidationPipe } from "npm:@nestjs/common@10.4.15";
import { NestFactory } from "npm:@nestjs/core@10.4.15";

import { AppModule } from "./app.module.ts";
import { isCorsOriginAllowed } from "./shared/auth/cors.ts";
import { HttpExceptionFilter } from "./shared/infrastructure/http/http-exception.filter.ts";
import { requestLoggingMiddleware } from "./shared/infrastructure/http/request-logging.middleware.ts";

const app = await NestFactory.create(AppModule);

app.enableCors({
  allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
  credentials: true,
  exposedHeaders: ["X-Request-Id"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  origin: (origin, callback) => {
    callback(null, isCorsOriginAllowed(origin));
  },
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

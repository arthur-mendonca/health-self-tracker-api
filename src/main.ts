import "npm:reflect-metadata";

import { ValidationPipe } from "npm:@nestjs/common@10.4.15";
import { NestFactory } from "npm:@nestjs/core@10.4.15";

import { AppModule } from "./app.module.ts";

const app = await NestFactory.create(AppModule);

app.enableCors();
app.useGlobalPipes(
  new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true
  })
);

const port = Number(Deno.env.get("PORT") ?? 3000);
await app.listen(port);

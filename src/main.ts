import "npm:reflect-metadata";

import { NestFactory } from "npm:@nestjs/core@10.4.15";

import { AppModule } from "./app.module.ts";

const app = await NestFactory.create(AppModule);

app.enableCors();

const port = Number(Deno.env.get("PORT") ?? 3000);
await app.listen(port);

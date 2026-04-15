FROM denoland/deno:debian

WORKDIR /app

ENV PORT=3000

COPY deno.json ./
COPY package.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN deno install --allow-scripts=npm:prisma,npm:@prisma/client,npm:@prisma/engines
RUN DATABASE_URL=postgresql://health_tracker:health_tracker_password@db:5432/quantified_self deno task prisma:generate

COPY src ./src

EXPOSE 3000

CMD ["deno", "task", "start"]

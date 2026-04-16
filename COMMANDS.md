# Comandos do Projeto

Este repositório contém somente o backend do Health Self Tracker.

## Requisitos

- Docker e Docker Compose para execução via container.
- Deno instalado localmente apenas se for rodar a API fora do Docker.

## Variáveis de Ambiente

Use `.env.example` como referência para a variável `DATABASE_URL`.

No Docker Compose, a API usa:

```text
postgresql://health_tracker:health_tracker_password@db:5432/quantified_self
```

Autenticação:

- `JWT_SECRET`: segredo usado para assinar tokens JWT.
- `AUTH_USER_EMAIL`: e-mail do usuário local inicial.
- `AUTH_USER_PASSWORD`: senha do usuário local inicial.

Para acesso local ao Postgres do container, use:

```text
postgresql://health_tracker:health_tracker_password@localhost:5433/quantified_self
```

## Rodar com Docker

Build da imagem:

```bash
docker compose build
```

Subir API e banco sem expor porta no host:

```bash
docker compose up -d
```

Subir API e banco para teste local, expondo a API somente em `127.0.0.1:3000`:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

Ver logs da API:

```bash
docker compose logs api -f
```

Parar containers:

```bash
docker compose down
```

Parar containers e remover volume do banco:

```bash
docker compose down -v
```

## Rodar Localmente

Requer Deno instalado no host e um PostgreSQL acessível pela `DATABASE_URL`.

Gerar Prisma Client:

```bash
deno task prisma:generate
```

Criar uma nova migration a partir de mudanças no `schema.prisma`:

```bash
deno task prisma:migrate:dev --name nome_da_migration
```

Aplicar migrations pendentes no banco configurado em `DATABASE_URL`:

```bash
deno task prisma:migrate:deploy
```

Rodar em modo desenvolvimento:

```bash
deno task dev
```

Rodar em modo start:

```bash
deno task start
```

## Produção

O container executa:

```bash
deno task prisma:migrate:deploy && deno task start
```

O Prisma Client é gerado durante o build da imagem.

Para aplicar migrations manualmente no container:

```bash
docker compose exec api deno task prisma:migrate:deploy
```

## Testes

Rodar testes unitários localmente:

```bash
deno task test
```

Rodar testes e2e localmente com a API ativa:

```bash
deno task test:e2e
```

Rodar testes unitários pelo container:

```bash
docker compose exec api deno task test
```

Rodar testes e2e pelo container:

```bash
docker compose exec api deno task test:e2e
```

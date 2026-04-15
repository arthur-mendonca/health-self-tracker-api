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

Para acesso local ao Postgres do container, use:

```text
postgresql://health_tracker:health_tracker_password@localhost:5433/quantified_self
```

## Rodar com Docker

Build da imagem:

```bash
docker compose build
```

Subir API e banco:

```bash
docker compose up -d
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
deno task start
```

O Prisma Client é gerado durante o build da imagem.

## Testes

Ainda não há suíte de testes configurada nesta Fase 1. Quando os testes forem adicionados, este arquivo deve ser atualizado com o comando oficial.


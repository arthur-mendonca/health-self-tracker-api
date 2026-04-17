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
- `CORS_ORIGINS`: lista de origens permitidas separadas por vírgula. Em produção, use `https://health-front.gestorinvest.xyz`.
- `AUTH_COOKIE_NAME`: nome do cookie de sessão. Padrão: `health_self_tracker_session`.
- `AUTH_COOKIE_DOMAIN`: domínio compartilhado do cookie. Em produção, use `.gestorinvest.xyz` para compartilhar sessão entre API e front.
- `AUTH_COOKIE_SECURE`: use `true` em produção HTTPS.
- `AUTH_COOKIE_SAME_SITE`: use `none` em produção com subdomínios diferentes e `lax` em desenvolvimento local.
- `AUTH_COOKIE_MAX_AGE_SECONDS`: duração do cookie em segundos. Padrão: `3600`.

Para o deploy com API em `https://health.gestorinvest.xyz` e front em `https://health-front.gestorinvest.xyz`, configure:

```text
CORS_ORIGINS=https://health-front.gestorinvest.xyz
AUTH_COOKIE_DOMAIN=.gestorinvest.xyz
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=none
AUTH_COOKIE_MAX_AGE_SECONDS=3600
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

> Atenção: `docker compose down -v` remove o volume `postgres_data` e apaga os dados locais do banco.

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

### Troubleshooting de credenciais do Postgres

Se os logs mostrarem `Authentication failed against the database server`, não remova o volume do banco. Em deployments como Coolify, confirme que estas variáveis estão coerentes entre API e Postgres:

```text
DATABASE_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
AUTH_USER_EMAIL
AUTH_USER_PASSWORD
```

Depois de corrigir a senha real do role usado pelo `DATABASE_URL`, reinicie a API para descartar conexões antigas do pool:

```bash
docker compose restart api
```

Em servidores onde o app foi gerado pelo Coolify e `docker compose` não encontra o arquivo de configuração, use `docker exec` com os nomes reais dos containers:

```bash
docker ps --format 'table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}'
```

Ver `DATABASE_URL` efetiva dentro da API sem revelar a senha:

```bash
docker exec <API_CONTAINER> sh -lc 'printf "%s\n" "$DATABASE_URL" | sed -E "s#(postgresql://[^:]+:)[^@]+(@.*)#\1***\2#"'
```

Testar a conexão a partir do container da API usando a própria `DATABASE_URL` da API:

```bash
docker exec <API_CONTAINER> sh -lc 'deno eval -A "import pg from \"npm:pg@8.16.3\"; const client = new pg.Client({ connectionString: Deno.env.get(\"DATABASE_URL\") }); await client.connect(); const result = await client.query(\"select current_user, current_database()\"); console.log(result.rows); await client.end();"'
```

Ver variáveis efetivas do container do Postgres sem revelar a senha:

```bash
docker exec <DB_CONTAINER> sh -lc 'echo "POSTGRES_USER=$POSTGRES_USER"; echo "POSTGRES_DB=$POSTGRES_DB"; echo "POSTGRES_PASSWORD_LENGTH=${#POSTGRES_PASSWORD}"'
```

Reiniciar a API depois de qualquer alteração de credencial do banco:

```bash
docker restart <API_CONTAINER>
```

Se houver mais de um container da API atrás do proxy, reinicie todos. Um container antigo com `DATABASE_URL` diferente pode causar falhas intermitentes enquanto outro container responde `200`.

A API também inclui `appInstanceId` nos logs, nas respostas de erro e no header `X-App-Instance-Id`. Se respostas `500` e `200` alternarem com `appInstanceId` diferente, o problema está em múltiplas instâncias/containers com configuração divergente.

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

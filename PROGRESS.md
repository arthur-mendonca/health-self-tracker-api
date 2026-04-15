# Health Self Tracker - Progresso

## Fase 1: Setup do Back-end, Banco de Dados e Docker

- [x] Inicializar um projeto NestJS padrão na raiz do projeto com Deno e `deno.json`.
- [x] Configurar o Prisma e aplicar o `schema.prisma`.
- [x] Criar um `Dockerfile` com imagem oficial do Deno e geração do Prisma Client durante o build.
- [x] Criar um `docker-compose.yml` com serviços `db` e `api`, redes e volumes.
- [x] Validar o build Docker-first com `docker compose build`.

## Fase 2: Construção da API (NestJS)

- [x] Gerar os recursos Tag, Substance e Activity.
- [x] Implementar lógica nos Services para gerar ULIDs nativamente.
- [x] Desenvolver o DailyRecordService com lógica transacional para criar o log, relações n:n e salvar `metrics` como JSONB.
- [x] Implementar o ExportModule com `GET /export/dump`.
- [x] Configurar CORS no `main.ts` para permitir requisições do frontend.

## Fase 3: Hardening do Back-end

- [x] Adicionar testes automatizados para casos de uso, controllers e repositórios críticos.
- [x] Substituir o fluxo baseado somente em `prisma db push` por migrations versionadas do Prisma.
- [x] Fortalecer validação dos DTOs com `ValidationPipe` e DTOs robustos.
- [x] Ajustar `GET /records/today` para usar `America/Sao_Paulo` em vez de UTC.
- [x] Adicionar suporte a CSV, PDF ou JSON estruturado em `/export/dump` ou rota equivalente de exportação.
- [x] Definir e implementar estratégia de autenticação para uso fora do ambiente local.
- [ ] Implementar uma estratégia de rate limiting para proteger a API contra abusos e ataques

## Fase 4: Validação do Back-end

- [ ] Testar o fluxo de API ponta a ponta somente no backend.
- [ ] Verificar no Postgres se os IDs gerados são ULIDs válidos.
- [ ] Validar o output JSON da rota de Dump.
- [ ] Validar o output CSV da exportação quando implementado.

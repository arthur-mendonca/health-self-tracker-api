# Health Self Tracker - Progresso

## Fase 1: Setup do Back-end, Banco de Dados e Docker

- [x] Inicializar um projeto NestJS padrão na raiz do projeto com Deno e `deno.json`.
- [x] Configurar o Prisma e aplicar o `schema.prisma`.
- [x] Criar um `Dockerfile` com imagem oficial do Deno e geração do Prisma Client durante o build.
- [x] Criar um `docker-compose.yml` com serviços `db` e `api`, redes e volumes.
- [x] Validar o build Docker-first com `docker compose build`.

## Fase 2: Construção da API (NestJS)

- [ ] Gerar os recursos Tag, Substance e Activity.
- [ ] Implementar lógica nos Services para gerar ULIDs nativamente.
- [ ] Desenvolver o DailyRecordService com lógica transacional para criar o log, relações n:n e salvar `metrics` como JSONB.
- [ ] Implementar o ExportModule com `GET /export/dump`.
- [ ] Configurar CORS no `main.ts` para permitir requisições do frontend.

## Fase 3: Setup e Construção do Front-end

- [ ] Criar uma pasta independente `frontend-app`.
- [ ] Inicializar um projeto SvelteKit do zero dentro de `frontend-app`.
- [ ] Configurar task Deno para rodar o Vite.
- [ ] Instalar e configurar Tailwind CSS.
- [ ] Construir o formulário principal com métricas dinâmicas.
- [ ] Criar selects inteligentes com autocompletar e criação on-the-fly.

## Fase 4: Integração e Testes

- [ ] Executar backend e frontend independentemente com Deno.
- [ ] Testar o fluxo ponta a ponta.
- [ ] Verificar no Postgres se os IDs gerados são ULIDs válidos.
- [ ] Validar o output da rota de Dump.

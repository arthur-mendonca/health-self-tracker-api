# Regras de Back-end: Arquitetura Hexagonal (Ports and Adapters)

**Alvo:** `backend-api` (NestJS executado em Deno).
**Aviso ao Agente de IA:** Você é ESTRITAMENTE PROIBIDO de criar a arquitetura padrão em camadas (Controller -> Service -> Prisma). Você DEVE implementar a Arquitetura Hexagonal conforme descrito abaixo.

## 1. Princípio Fundamental (A Regra de Dependência)

As dependências devem apontar apenas para dentro. A camada de Domínio (Core) não sabe NADA sobre o banco de dados (Prisma), sobre a web (HTTP/Controllers) ou sobre o framework (NestJS).

## 2. Estrutura de Diretórios Obrigatória

Cada módulo (ex: `daily-record`) deve seguir exatamente esta topologia de pastas:

```text
src/
└── modules/
    └── daily-record/
        ├── domain/                  # CORE: Sem dependências externas
        │   ├── entities/            # Classes puras do TypeScript (ex: DailyRecord.ts)
        │   └── exceptions/          # Erros de domínio
        ├── application/             # CASOS DE USO E PORTAS
        │   ├── ports/               # Interfaces (Inbound e Outbound)
        │   │   ├── in/              # Interfaces dos Casos de Uso (ex: CreateDailyRecordUseCase.ts)
        │   │   └── out/             # Interfaces de Repositórios (ex: DailyRecordRepositoryPort.ts)
        │   └── use-cases/           # Regras de negócio orquestradas (Serviços)
        ├── infrastructure/          # ADAPTADORES (Mundo Externo)
        │   ├── http/                # Inbound Adapters: Controllers e DTOs
        │   │   ├── controllers/
        │   │   └── dtos/
        │   └── persistence/         # Outbound Adapters: Repositórios do Prisma
        │       ├── prisma/
        │       └── mappers/         # Converte Entidades Prisma <-> Entidades de Domínio
        └── daily-record.module.ts   # A "Cola" do NestJS (Injeção de Dependência)
```

## 3. Regras por Camada

### Camada 1: Domain (O Núcleo)

O que contém: Entidades puras e regras intrínsecas ao negócio.
Regras:
NÃO importe nada do NestJS (nem @Injectable()).
NÃO importe nada do Prisma (@prisma/client).
A geração de ULID (import { ulid } from "npm:ulid") deve ocorrer dentro das Entidades ou Factories de Domínio.
Exemplo: A entidade DailyRecord deve lidar com as métricas (JSON) e validações internas.

### Camada 2: Application (Portas e Casos de Uso)

Portas Inbound (Entrada): Interfaces que definem o que o sistema pode fazer.
Portas Outbound (Saída): Interfaces que o domínio usa para se comunicar com o banco de dados. Exemplo: IDailyRecordRepository.
Casos de Uso (Services):
Orquestram a lógica (ex: "Verificar se as tags existem, criar on-the-fly, salvar o log").
Usa o decorador @Injectable() do NestJS (única exceção de framework nesta camada).
NUNCA devem injetar o PrismaService. Devem injetar a interface do Repositório (Porta Outbound).

### Camada 3: Infrastructure (Adaptadores)

- Controllers (Inbound Adapter): Recebem a requisição HTTP HTTP, validam os DTOs e chamam os Casos de Uso Inbound. Não possuem regras de negócio.

- Prisma Repositories (Outbound Adapter):
  - Implementam as Portas Outbound (ex: class PrismaDailyRecordRepository implements IDailyRecordRepository).
  - Injetam o PrismaService.
- Mappers (CRÍTICO): O banco de dados retorna objetos do Prisma. O adaptador HTTP recebe DTOs. Os Casos de Uso usam Entidades de Domínio. Mappers são obrigatórios para converter PrismaModel -> DomainEntity e DomainEntity -> PrismaModel. Nunca vaze modelos do Prisma para os casos de uso.

## 4. Injeção de Dependências no NestJS (O Padrão)

Como as portas de saída (out/) são Interfaces do TypeScript (que somem após a compilação), o NestJS precisa de Custom Providers baseados em strings/symbols.
O agente de IA DEVE registrar repositórios no \*.module.ts usando a propriedade provide:

```
// Exemplo de como a IA deve configurar o Module
import { Module } from '@nestjs/common';
import { CreateDailyRecordService } from './application/use-cases/CreateDailyRecordService';
import { PrismaDailyRecordRepository } from './infrastructure/persistence/prisma/PrismaDailyRecordRepository';
import { DailyRecordController } from './infrastructure/http/controllers/DailyRecordController';

@Module({
controllers: [DailyRecordController],
providers: [
CreateDailyRecordService, // O Caso de Uso
{
provide: 'IDailyRecordRepository', // O Token da Interface (Porta Outbound)
useClass: PrismaDailyRecordRepository, // O Adaptador (Prisma)
},
],
})
export class DailyRecordModule {}
```

## 5. Regras de Transação e On-the-Fly Creation

- No contexto do "Fricção Zero", a criação de um log diário envolve salvar métricas, checar se N Tags/Substâncias existem e criá-las se não existirem.
- O Caso de Uso orquestrará esse fluxo.
- O repositório Prisma correspondente deve utilizar o padrão de Nested Writes (create, connectOrCreate) do Prisma, escondido atrás da interface do repositório, para garantir a atomicidade sem vazar transações do Prisma para a camada de aplicação.

## 6. Lembretes Globais

- Lembre-se que o ambiente é o Deno. Utilize deno.json para regras do TypeScript.
- As classes de infraestrutura usarão bibliotecas, mas as classes de domain/ devem ser TypeScript vanilla.

## 7. Regras de Infraestrutura (Docker e Deploy)

A API deve ser totalmente conteinerizada. O agente de IA deve garantir que:

- **Imagem Base:** Utilize a imagem oficial do Deno (ex: `denoland/deno:2.0.0` ou a mais recente compatível).
- **Prisma no Docker:** O Prisma compila binários específicos do sistema operacional (Query Engine). O agente de IA deve configurar o `Dockerfile` para rodar `deno run -A npm:prisma generate` _durante o build_ da imagem, ou garantir que o `schema.prisma` possua os `binaryTargets` corretos para o SO do container (ex: `debian-openssl-3.0.x`).
- **Variáveis de Ambiente:** O banco de dados no `docker-compose.yml` não deve estar exposto localmente em conflito com portas padrão (se necessário), e a `DATABASE_URL` no serviço da API deve apontar para o nome do serviço do banco de dados no compose (ex: `postgresql://user:pass@db:5432/quantified_self`).
- **Execução:** O container deve inicializar a aplicação utilizando o comando do Deno (ex: `deno task start` ou `deno run --allow-all src/main.ts`).

### Como usar na prática com o Agente:

Quando você for pedir para ele gerar o backend (Fase 1 ou 2 do `PROGRESS.md`), passe a instrução:

> _"Inicie a configuração do back-end. Para toda a construção da API, você deve ler e seguir estritamente as regras arquiteturais contidas no arquivo `backend-rules.md`. Não gere código com acoplamento direto entre Controllers e Prisma."_

# Arquitetura do Frontend

Frontend em **Next.js (App Router) + TypeScript + Tailwind**. O código é organizado em
**camadas com responsabilidade única e dependências unidirecionais**, aplicando os
princípios de **baixo acoplamento**, **alta coesão**, **componentização** e **separação
entre código síncrono e assíncrono**.

## Camadas

```
┌─────────────────────────────────────────────────────────────┐
│  page.tsx  (Orquestrador)                                     │
│  Conecta hooks a componentes. Sem regra de negócio nem fetch. │
└───────────────┬───────────────────────────┬─────────────────┘
                │                            │
        ┌───────▼────────┐          ┌────────▼─────────┐
        │  components/   │          │     hooks/       │
        │  (apresentação)│          │  (estado React + │
        │  props in,     │          │   orquestração)  │
        │  callbacks out │          └───┬──────────┬───┘
        └────────────────┘              │          │
                                ┌────────▼──┐   ┌───▼──────────┐
                                │ services/ │   │    lib/      │
                                │ (ASSÍNCRONO│   │ (SÍNCRONO    │
                                │  — API)   │   │  puro)       │
                                └─────┬─────┘   └──────────────┘
                                      │
                                 ┌────▼────┐
                                 │  api.ts │  (axios + interceptors)
                                 └─────────┘

           types/  → contratos (interfaces) compartilhados por todas as camadas
```

**Regra de dependência (setas só apontam para baixo):**
`components → (props)` · `hooks → services + lib` · `services → api` · `lib` não conhece
React. Um componente **nunca** chama a API direto; a lógica pura **nunca** importa React.

## Estrutura de pastas (`app/`)

| Pasta | Papel | Exemplos |
|-------|-------|----------|
| `types/` | Interfaces do domínio | `Ordem`, `Usuario`, `Filtros`, `SlaStatus` |
| `lib/` | Lógica **pura síncrona** (sem React) | `sla.ts`, `seguranca.ts`, `constantes.ts`, `normalizacao.ts`, `csv.ts` |
| `services/` | Acesso **assíncrono** à API (axios) | `ordensService.ts`, `usuariosService.ts`, `metadadosService.ts`, `perfilService.ts` |
| `hooks/` | Estado + orquestração (React) | `useChamados`, `useChamadoModal`, `useTecnicoBusca`, `useUsuarios` |
| `components/` | Apresentação (recebe props, emite callbacks) | `chamados/`, `modal/`, `usuarios/`, e compartilhados (`Badge`, `PaginacaoBar`) |
| `page.tsx` | Orquestrador de cada tela | `app/page.tsx`, `app/usuarios/page.tsx` |

## Onde cada conceito aparece

### 🧩 Componentização
- A tela de chamados saiu de **1 arquivo de 1428 linhas** para um orquestrador de **~130
  linhas** + componentes pequenos e focados: `ChamadosHeader`, `ChamadosFiltros`,
  `ChamadosTabela`, `ModalChamado` (e seus subcomponentes `TecnicoAutocomplete`,
  `PainelSla`, `ListaComentarios`, `FormComentario`, `Historico`).
- Componentes **reutilizáveis** entre telas: `PaginacaoBar` (chamados **e** usuários,
  parametrizado por rótulo) e `Badge`.

### 🔗 Baixo acoplamento
- Componentes recebem **dados via props** e comunicam **via callbacks** — não sabem de
  onde os dados vêm nem como são buscados.
- Ninguém importa `axios` diretamente; tudo passa pela camada `services/`. Trocar a API
  ou a lib HTTP afeta só `services/` + `api.ts`.
- **Barrels** (`index.ts`) expõem uma API pública por módulo, escondendo a estrutura
  interna: `import { useChamados } from "./hooks"`.

### 🎯 Alta coesão
- Cada arquivo tem **uma responsabilidade**: `useTecnicoBusca` cuida só do autocomplete
  de técnico; `sla.ts` só do cálculo de SLA; `csv.ts` só da exportação.
- Regras relacionadas ficam juntas (o cálculo de SLA e seus estados de cor no mesmo lugar).

### ⚙️ Síncrono × Assíncrono
- **Assíncrono** isolado em `services/` (chamadas HTTP) e nos hooks que as orquestram
  (`useChamados.buscarChamados`, debounce, `useTecnicoBusca` com _guard_ de `request-id`
  para descartar respostas obsoletas).
- **Síncrono puro** em `lib/` (cálculos, formatação, validação) — funções determinísticas,
  fáceis de testar, sem efeitos colaterais nem React.

## Fluxo de dados (exemplo: listar chamados)

```
page.tsx  → useChamados()          (hook: estado dos filtros + debounce)
          → ordensService.listar() (service: GET /ordens)
          → api.ts                 (axios + token)
          ← Ordem[] + Meta
page.tsx  → <ChamadosTabela ordens=… onAbrir=… />   (componente: só renderiza)
```

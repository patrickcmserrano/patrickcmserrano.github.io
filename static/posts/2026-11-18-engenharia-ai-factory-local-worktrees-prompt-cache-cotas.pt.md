# Engenharia de uma AI Factory Local: Worktrees, Prompt Cache e Economia de Cotas entre Modelos

*Quando você passa de um agente no terminal para sprints inteiras rodando de forma autônoma, o gargalo deixa de ser o prompt e vira engenharia de sistemas: topologia Git, contexto determinístico e bin-packing de cotas heterogêneas.*

Rodar um agente de código para corrigir um bug isolado é fácil. O problema real começa quando você tenta encadear 15 tarefas consecutivas em um sistema distribuído em produção — Go concorrente, NATS JetStream, múltiplos coletores WebSocket, contratos compartilhados em módulos externos e um portal em Svelte — sem deixar o agente alucinar assinaturas, quebrar a `master` ou torrar a cota semanal inteira na terça-feira.

Neste artigo, documento as lições práticas que emergiram ao planejar, auditar e calibrar duas sprints reais do `ark-streams` (`ARK-130` a `ARK-145`) rodando sobre uma AI Factory local construída em Go e Clojure/Babashka.

---

## 1. A Arquitetura em Quatro Camadas

Em vez de tratar o LLM como um operador onisciente com acesso irrestrito ao terminal e às chaves de API, a infraestrutura local separa responsabilidades em quatro camadas determinísticas:

```text
┌────────────────────────────────────────────────────────────────────┐
│  4. Isolamento & Qualidade (AGENTS.md + git worktree + Red→Green)  │
│     • Branch dedicada feat/TASK_ID em worktree isolado             │
│     • Locked-Test: testes travados na fase Green + gate-cmds       │
├────────────────────────────────────────────────────────────────────┤
│  3. Orquestração & Cotas (swe-dispatcher — Babashka / Clojure)     │
│     • sprint_runner.clj: execução serial encadeada (.tasks.edn)    │
│     • sprint_windows.clj + autoresume: scheduling work-conserving  │
├────────────────────────────────────────────────────────────────────┤
│  2. Contexto Determinístico (context-graph-engine / repo-index)    │
│     • Go puro (stdlib-only, zero LLM, zero rede)                   │
│     • Pipeline: scan -> graph -> navigate -> pack -> envelope      │
├────────────────────────────────────────────────────────────────────┤
│  1. Inferência, Roteamento & Telemetria (small-router — Go)        │
│     • Proxy local (127.0.0.1:8081), zero exposição de API keys     │
│     • Circuit breaker, loop detector, Prometheus + Git Bridge      │
└────────────────────────────────────────────────────────────────────┘
```

Dois detalhes arquiteturais fazem a maior diferença na prática:

1. **O `small-router` implementa uma *Git Bridge*:** cada execução correlaciona automaticamente a branch (`feat/ARK-110`, por exemplo) com consumo de tokens, *cache hit rate*, quantidade de turnos e custo equivalente em USD, persistidos em estado local (`router_state.json`). Isso transforma estimativa de sprint em estatística empírica, não em chute.
2. **O `repo-index` gera envelopes com prefixo estável:** em vez de o agente gastar 10 turnos rodando `find` e `grep` recursivos, ele recebe um pacote determinístico (`facts.json` + `graph.json`) montado sob um orçamento fixo de tokens. Além de reduzir turnos, o prefixo estável empurra a taxa de acerto do *prompt cache* para a faixa de **94% a 95%**.

---

## 2. Quatro Modos de Falha que Só Aparecem Antes do Runner Disparar

Antes de acionar o orquestrador em uma fila de 16 tarefas, uma revisão cruzada dos planos revelou quatro problemas estruturais que teriam causado falhas silenciosas ou desperdiçado ciclos de inferência.

### Colisão de IDs como falha de integridade referencial

Em uma AI Factory automatizada, o ID da tarefa (`ARK-130`) não é apenas um rótulo em um documento Markdown. Ele é a chave primária que dá nome à branch (`feat/ARK-130`), ao diretório do worktree (`/worktrees/ARK-130`) e ao registro de telemetria na Git Bridge.

Encontramos IDs reutilizados entre três planos distintos no mesmo repositório (`ARK-121..124` já concluídos na sprint `alpha-shadow-v1` reaparecendo na `ingest-capacity`, e `ARK-130..131` colidindo entre observabilidade e capacidade de ingestão). A regra passou a ser estrita: **IDs são globais e monotônicos no repositório**, nunca reciclados por sprint.

### Vazamento de fronteira de repositório (`:repo` e `:gate-cmds`)

A tarefa `ARK-132` (adicionar um badge de OOS vs. Live no portal Svelte/NPM) estava listada dentro do mesmo arquivo `.tasks.edn` que as tarefas Go do `ark-streams`.

O problema é duplo:

* O runner lia `:repo` e `:gate-cmds` (`go test ./...` e `go vet ./...`) do mapa raiz do plano.
* O mecanismo de encadeamento (`chain-plan`) cria cada worktree a partir da branch da tarefa anterior.

Se tivesse rodado assim, o runner abriria um worktree de `ark-streams` a partir de `feat/ARK-130`, mandaria o agente editar um componente Svelte inexistente e falharia no gate Go. **Lição:** fronteira de repositório (ou de toolchain de validação) deve ser fronteira de plano `.tasks.edn`.

### Encadeamento linear (`chain-plan`) vs. frescor do índice

Uma preocupação clássica com worktrees isolados é o grafo de dependências: se a tarefa `ARK-140` (novo coletor da Binance) depende de `wsConn` e `publisher.go` criados nas tarefas `ARK-135` e `ARK-137`, abrir todos os worktrees a partir de `master` quebra o build.

No `sprint_runner.clj`, o modelo adotado resolve isso sem merge prematuro na `master`:

```bash
# Tarefa 1 nasce de :base-branch (master)
git worktree add -b feat/ARK-133 worktrees/ARK-133 master

# Tarefa i nasce da branch da tarefa i-1
git worktree add -b feat/ARK-134 worktrees/ARK-134 feat/ARK-133
```

Imediatamente após criar cada worktree, o próprio runner executa `repo-index scan`, `verify` e `pack`. O resultado prático é que, quando a fila chega nos cinco coletores da Fase 4 (`ARK-140..144`), o envelope determinístico já contém as assinaturas exatas de `wsConn`, `StreamTradesRaw` e `publisher.go`.

A contrapartida é que **a ordem do vetor `:tasks` passa a ser lei** — e, na passagem da Sprint 1 para a Sprint 2, a segunda sprint precisa apontar `:base-branch` para a ponta da primeira (ou aguardar o fast-forward na `master`) para herdar os símbolos compartilhados (`AltCascadeBasket`).

### Confinamento do agente vs. contratos cross-repo

A tarefa `ARK-136` exigia adicionar campos de telemetria (`event_ts`, `recv_ts` e `completeness`) nos structs do módulo externo `ark-protocol` e consumi-los no `ark-streams`.

Como o agente roda confinado ao worktree — e políticas de path impedem escrita fora dele — tentar editar dois repositórios na mesma tarefa é um antipadrão. Além disso, um `replace ../ark-protocol` no `go.mod` funciona no clone raiz, mas quebra dentro de `worktrees/ARK-136` por estar um nível de diretório mais fundo. A solução limpa foi atualizar `ark-protocol`, validar `go test`/`go vet` e publicar a tag `v0.1.0` *antes* de disparar a fila, reduzindo o escopo do agente no `ark-streams` a um bump limpo no `go.mod`.

---

## 3. A Economia Real: O que a Telemetria Empírica Revela

Com 100 tarefas registradas no `router_state.json`, deu para substituir achismo por números reais antes de escolher modelos e níveis de `:effort`.

### Benchmark conservador vs. realidade medida

Nas 88 tarefas executadas com `claude-sonnet-5-5`, a média real foi de **$0.672** e **19,7 turnos** por tarefa. Recortando especificamente as tarefas anteriores do próprio `ark-streams` (`ARK-110` a `ARK-115`, todas em `effort: medium`), o custo médio caiu para **$0.579** (11 a 31 turnos, 6/6 aprovadas de primeira) — bem abaixo do benchmark conservador de **$0.76** usado pelo estimador da sprint.

| Perfil de Tarefa (Histórico `ARK-110..115`) | Turnos | Custo Real (`Sonnet 5.5`) |
| --- | --- | --- |
| Correções P0 de código (`ARK-110..112`) | 11–15 | $0.346 – $0.387 |
| Revisão e análise (`ARK-113`) | 31 | $0.686 |
| Fixes e hardening de concorrência (`ARK-114..115`) | 20–27 | $0.835 – $0.853 |

### O multiplicador silencioso do Prompt Caching

Quando simulamos rodar todas as 16 tarefas (2 `low`, 12 `medium`, 2 `high`) na API sob demanda da DeepInfra com `deepseek-v4.1-flash` ($0.14/1M input, $0.0042/1M cached input, $0.42/1M output), o impacto da arquitetura de contexto ficou explícito:

| Cenário de Cache (16 tarefas) | Custo Médio / Tarefa | Total da Sprint |
| --- | --- | --- |
| **Com cache (~94–95% hit, envelope `repo-index`)** | ~$0.021 – $0.031 | **~$0.33 – $0.49** |
| **Sem cache (0% hit — pior caso)** | ~$0.19 – $0.28 | **~$3.07 – $4.48** |

É uma diferença de **9× a 10× no custo total** sem trocar uma linha de código do modelo. Em agentes multi-turno, onde o histórico cresce a cada chamada de ferramenta, manter um prefixo de contexto estável deixa de ser otimização prematura e vira o principal fator econômico do sistema.

### Por que o modelo frontier quase nunca é o padrão ideal

Uma pergunta natural diante de duas tarefas críticas de concorrência em Go — `ARK-135` (`publisher.go` assíncrono) e `ARK-137` (`wsConn` com keepalive e backoff por exchange) — foi: *por que rodar em `claude-sonnet-5-5 (high)` em vez de `claude-opus-5-5 (high)`?*

Os números calibrados no `sprint_runner.clj` respondem:

| Modelo (`effort: high`) | Custo / Tarefa | Tempo / Tarefa | Total (`ARK-135` + `ARK-137`) |
| --- | --- | --- | --- |
| `claude-sonnet-5-5` | $1.39 (~69 turnos) | ~5,8 min | **$2.78** (~11,6 min) |
| `claude-opus-5-5` | $4.73 (~160 turnos) | ~40 min | **$9.46** (~80 min) |

O Opus consome **3,4× mais cota** e leva **~7× mais tempo de relógio**. Em um cenário com cota semanal compartilhada (onde o bucket de Claude/GPT estava em 46,5% restantes para quase 7 dias), um único *retry* em Opus comprometeria boa parte da semana inteira. Como o histórico empírico já mostrava 100% de aprovação do Sonnet 5.5 em concorrência e rate-limiting (`ARK-115`), a estratégia mais racional é clara: **Sonnet 5.5 (`high`) no caminho feliz; Opus apenas como política de escalonamento se o gate falhar**.

---

## 4. Bin-Packing de Cotas Heterogêneas

Um erro comum ao planejar sprints autônomas é olhar apenas para o custo total estimado contra o limite da janela:

* Sprint 1 (`ARK-130..132`): **~$1.91** (~7,7 min)
* Sprint 2 (`ARK-133..145`): **~$10.77** (~43,3 min)
* **Soma:** **$12.68** dentro de uma janela de 5 horas de **$13.08** (96,9% de ocupação).

No papel, cabe. Na operação, **96,9% de ocupação com `:max-attempts 2` é praticamente garantia de interrupção**: basta um único *retry* em uma tarefa `medium` ($0.76) ou `high` ($1.39) para estourar os $0.40 de folga.

Além disso, planos modernos de agentes não operam com um único saldo linear em dólares, mas com **múltiplos buckets com janelas e taxas de renovação independentes**:

* **Bucket Anthropic (janela móvel de 5 h):** $13.08, com limiar de janela limpa em pelo menos $8.00 livres.
* **Bucket compartilhado Gemini (5 h + semanal):** agrupa `Gemini 4 Neon`, `Gemini 4 Hydrogen` e `Gemini 3.8 Flash` sob a mesma cota.
* **Bucket Claude & GPT (5 h + semanal):** capacidade cheia na janela curta, mas restrito pelo orçamento semanal.
* **Pool isolado (Argon):** cota semanal separada.
* **API pay-as-you-go (DeepInfra):** sem teto de janela curta, custo marginal baixíssimo com cache alto.

A consequência direta foi modelar esses pools explicitamente no `sprint_windows.clj` e rotear cada tarefa pelo seu **risco técnico**, não por uniformidade:

| Classe de Tarefa | Exemplos nas Sprints | Alocação Ótima | Justificativa |
| --- | --- | --- | --- |
| **Config estática, docs e UI isolada** | `ARK-132` (badge Svelte), `ARK-134` (runbook), `ARK-139` (`docker-compose` + `sysctl`) | `gemini-3.8-flash` (`low`/`medium`) | Risco arquitetural baixo; tira ~$1.54 da janela crítica do Claude. |
| **Implementação padronizada sobre interface pronta** | `ARK-140..144` (5 coletores sobre `wsConn` + `publisher.go`) | `gemini-3.8-flash` ou `gemini-4-hydrogen` (`medium`), ou `deepseek-v4.1-flash` | O `repo-index` já injeta as interfaces reais; padrão repetitivo com gate automatizado. |
| **Núcleo concorrente e infraestrutura de mensageria** | `ARK-133` (`TRADES_RAW`), `ARK-135` (`publisher.go`), `ARK-137` (`wsConn`), `ARK-138` (multiplex Bitget) | `claude-sonnet-5-5` (`medium`/`high`) | Onde bugs sutis de race condition custam caro; consome ~58% de uma janela de 5 h, deixando **$5.42 de folga** para retries. |
| **Escalonamento sob falha** | Qualquer tarefa que estoure gate após 1ª tentativa | `claude-opus-5-5` ou `gemini-4-neon (high)` | Preserva cota semanal usando força bruta apenas onde houve bloqueio real. |

---

Escalar engenharia de software com agentes autônomos raramente passa por comprar o maior modelo do mercado e escrever prompts mais longos. O ganho real vem de tratar o ciclo agêntico como um sistema distribuído clássico: contexto indexado de forma determinística para maximizar cache, worktrees encadeados com gates rígidos para conter regressões, contratos cross-repo versionados antes do disparo e telemetria por tarefa para transformar janelas de cota heterogêneas em capacidade previsível.

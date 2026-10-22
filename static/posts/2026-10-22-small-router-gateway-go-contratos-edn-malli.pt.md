---
title: 'small-router: Por Que Construí um Gateway de Inferência em Go com Contratos em EDN/Malli'
date: '2026-10-22'
tags: ['small-router', 'Go', 'Clojure', 'EDN', 'Malli', 'AI Factory', 'Svelte', 'Wails', 'Architecture']
summary: 'Bastidores do plano de execução para agentes de código: resiliência com circuit breakers, interrupção graciosa de loops degenerados sem erro 502, observabilidade 100% cega ao conteúdo, app desktop em Wails v2 + Svelte e negociação de conteúdo dual-stack JSON/EDN validada por schemas Malli no Babashka.'
---

**Série AI Factory & Engenharia de Agentes — Parte 2 de 6**

No [primeiro artigo desta série](/blog/2026-10-22-ai-factory-privacidade-por-arquitetura/), mostrei como desenhamos a infraestrutura soberana da **AI Factory** na **Ping Hai**: jaulas FreeBSD isoladas por VNET, sanitização de PII pré-vetor, *Egress Gate fail-closed* e uma frota híbrida de GPUs com Slurm e vLLM.

Mas existe uma segunda camada igualmente crítica quando você usa agentes autônomos de código (como `Qwen Code`, `Claude Code`, `Aider` ou orquestradores multi-papel) durante 10 horas por dia: **o plano de execução de inferência**.

Conectar um agente de código diretamente à API de um provedor de LLM funciona bem nos primeiros cinco minutos. Na primeira semana de uso intenso em produção, a realidade cobra o preço:
1. O provedor sofre uma oscilação de rede ou devolve `429 Too Many Requests` no turno 18 de uma refatoração, derrubando a tarefa inteira.
2. Um agente entra em *loop* autônomo de tentativa-e-erro na madrugada e queima dezenas de dólares antes de alguém notar.
3. O modelo entra em repetição degenerada no meio de um *stream* SSE (repetindo a mesma frase ou comando dezenas de vezes) e corrompe a janela de contexto.
4. O agente lê acidentalmente um arquivo `.env` ou um mapa de configuração com credenciais e tenta enviá-lo no prompt para um provedor externo.

Foi para resolver esses problemas de forma determinística, num único binário autossuficiente e sem dependências externas de runtime, que construí o **[`small-router`](/trabalho/small-router/)** em **Go**. Ao longo de **76 commits** nos últimos meses, ele evoluiu de um proxy HTTP enxuto para um cockpit completo de governança de inferência — com direito a uma ponte nativa para o ecossistema **Clojure (EDN + Malli + Babashka)** e um aplicativo desktop em **Wails v2 + Svelte**.

---

## 🧭 Visão Geral: Uma Única Porta OpenAI-Compatible, Múltiplos Motores

Para o agente de código na ponta, o `small-router` parece um endpoint OpenAI padrão (`POST /v1/chat/completions` e `GET /v1/models`). Por trás dessa superfície única, toda requisição atravessa um pipeline estrito de segurança, orçamento, roteamento semântico e resiliência antes de tocar qualquer GPU local ou provedor em nuvem:

```text
Agentes de Código (Qwen Code, Claude Code, Orquestradores Multi-Agente)
       │
       │  POST /v1/chat/completions  (X-Session-ID, X-Task-ID, Accept: application/edn)
       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           SMALL-ROUTER (Go Daemon)                           │
│                                                                              │
│  1. Auth & Isolamento ──▶ Hash SHA-256 constant-time + Allowlist por Projeto │
│  2. Barreira MR-019   ──▶ Scanner Pré-Voo (AWS, PEM, sk-*, .env, EDN keys)   │
│  3. Ledger de Budget  ──▶ Teto Diário ($75/dia) + Loop Guard por Sessão      │
│  4. Roteador Semântico──▶ Resolução de Aliases/Capabilities + Fallback Chain │
│  5. Pilha Resiliência ──▶ Circuit Breaker (por Provedor) + Retry c/ Jitter   │
│  6. Stream Inspector  ──▶ Detector de Loops Degenerados c/ Parada Graciosa   │
└──────────────┬───────────────────────────────────────────────┬───────────────┘
               │                                               │
               ▼                                               ▼
   FROTA PRÓPRIA LOCAL (vLLM / Slurm)              PROVEDORES SERVERLESS APROVADOS
   • Qwen3-Coder-30B-A3B ($0.00)                   • Fireworks AI / DeepInfra
   • DeepSeek-V4 Flash Local ($0.00)               • GLM-5.3 Flash / DeepSeek-V4 / Kimi
```

Três regras de engenharia guiaram o desenho do roteador desde o primeiro dia:
* **"Um modelo nomeado é uma instrução, não uma dica":** Se o cliente pede uma política abstrata (`model: "coding"`, `"fast"`, `"reasoning"`, `"cheap"`), o roteador resolve para o melhor modelo configurado e percorre a cadeia de *fallback*. Mas se o cliente pede explicitamente um modelo concreto para um *benchmark*, o roteador respeita a instrução sem trocar o modelo silenciosamente.
* **Nunca ter como padrão o modelo mais caro do menu:** O alias `default` e `fast` apontam para modelos de alta velocidade, janela de 1M tokens e *prompt caching* agressivo (93%+ de *hit rate*), deixando os modelos *frontier* mais caros apenas para escalada explícita (`code-pro`, `reasoning`).
* **Falhar na inicialização, nunca no meio da requisição:** Toda a topologia de provedores, modelos, políticas e cadeias de *fallback* é validada no *boot*. Se uma rota aponta para um modelo inexistente, o processo recusa subir.

---

## ⚡ Pilha de Resiliência e Contabilidade Honesta de Custos

Quando um agente dispara uma requisição, o motor em `internal/router` percorre a cadeia de *fallback* seguindo uma máquina de estados clara:

1. **Saúde por Provedor (`internal/breaker` & `internal/health`):** O *circuit breaker* (`CLOSED` → `OPEN` → `HALF_OPEN`) é rastreado **por provedor**, e não apenas por modelo. Se um provedor upstream cai, o disjuntor abre após `failure_threshold` falhas consecutivas e todas as chamadas seguintes pulam imediatamente para o próximo provedor da cadeia (por exemplo, da nuvem para a frota local `own-fleet` em vLLM), sem esperar timeouts em cada modelo.
2. **Retry Desacoplado com Backoff Exponencial e Jitter (`internal/retry`):** Erros transitórios (`429`, `502`, `503`, timeouts de handshake/header estritamente limitados) sofrem retentativa automática. Já erros definitivos (`400 Bad Request` ou `401 Unauthorized` local) abortam a cadeia na hora — porque tentar o mesmo payload malformado em outro modelo só desperdiçaria tempo e dinheiro.
3. **Ledger Diário Atômico (`internal/budget` & `internal/state`):** O pacote de orçamento acumula o custo real em memória de forma *thread-safe*, faz o *rollover* automático à meia-noite UTC sem precisar reiniciar o daemon e persiste o estado atomicamente em disco (`ExportState` / `ImportState`) para que reinicializações de manutenção nunca zerem o teto diário de segurança.

### Honestidade Matemática nos Custos (`priced` e `cost_exact`)

Muitos proxies de LLM mentem sem querer nas métricas financeiras: quando um modelo não tem tabela de preço cadastrada, o custo aparece como `$0.00` (fazendo um modelo pago parecer gratuito ao lado dos outros); e quando há *hit* de *prompt cache*, misturam estimativas com valores exatos.

No `small-router`, cada requisição carrega duas *flags* explícitas nos logs e nas métricas Prometheus (`router_cost_usd_total`):
* `priced: false` quando o modelo não possui bloco de preço configurado (separando modelos gratuitos da frota própria de modelos apenas não precificados).
* `cost_exact: false` quando houve aproveitamento de *prompt cache* (`cached_tokens > 0`), mas a tarifa específica de `cached_input` não foi informada — sinalizando que o valor calculado é um **teto conservador**, e nunca uma subestimativa.

---

## 🔄 O Guardião de Loops Degenerados: Fim dos Erros `502` Destrutivos

Quem opera modelos *open-weight* rápidos ou agentes com janelas longas (256k a 1M de tokens) já viu esse fenômeno acontecer: de repente, no meio de uma resposta em *streaming*, o modelo prende num atrator de atenção e começa a emitir a mesma sentença ou comando dezenas de vezes seguidas.

Na primeira versão do detector, quando o `small-router` identificava o loop, ele abortava a conexão retornando um erro `HTTP 502` (`"degenerate loop detected"`). Na prática, isso era um tiro no pé por dois motivos:
1. **Falsos positivos em comandos técnicos:** Quando um agente listava comandos contendo nomes de hosts ou IPs (`ssh -J cluster.wg user@node01.internal` ou arquivos `configs/router.yaml`), um separador ingênuo baseado no caractere ponto (`.`) achava que os domínios eram fins de frase.
2. **Perda total do trabalho do turno:** Ao receber um erro `502` no meio do stream SSE, a CLI do agente sofria um crash de protocolo e **descartava todos os tokens válidos** que o modelo havia acabado de gerar antes de entrar em loop.

Redesenhamos completamente esse subsistema em duas frentes (`internal/repeat` e `internal/api/chat.go`):

```text
Stream SSE do Modelo Upstream
       │
       ▼
[Segmentador Inteligente (internal/repeat)]
 • Ignora '.' dentro de domínios (cluster.wg), IPs (10.0.0.1),
   extensões de arquivo (router.edn) e reticências (...)
       │
       ├──▶ Normal (< 5 repetições): encaminha chunk SSE ao agente
       │
       └──▶ Loop Detectado (>= 5 repetições de segmento >= 20 chars):
             1. Corta imediatamente o stream upstream (economiza tokens/GPU)
             2. Entrega 100% dos tokens válidos já gerados
             3. Emite chunk final padrão: finish_reason: "stop" + data: [DONE] (HTTP 200)
             4. Registra o incidente em memória (GET /v1/loop-detections)
```

O resultado em produção mudou da água para o vinho: quando um modelo engasga no final de uma resposta longa, o `small-router` **para o sangramento de tokens imediatamente**, fecha o stream com um `HTTP 200` limpo e o agente preserva toda a resposta útil no seu contexto para continuar trabalhando no turno seguinte sem perder o fio da meada.

---

## 🛡️ Segurança Pré-Voo (MR-019) e Observabilidade 100% Cega ao Conteúdo

Assim como no núcleo da AI Factory, o `small-router` segue o princípio de **observabilidade cega ao conteúdo**. Cada requisição gera exatamente uma linha JSON estruturada e atualiza contadores Prometheus de cardinalidade fixa — contendo latência total, *Time To First Token* (`ttft_ms`), tokens de entrada/cache/saída, projeto, tarefa (`X-Task-ID`) e custo, mas **jamais o texto do prompt, a resposta do modelo ou o payload de ferramentas**.

Antes mesmo de qualquer byte sair da máquina rumo a um provedor, o pacote `internal/redact` executa a barreira **MR-019** (ativa por padrão em 100% das chamadas):
* Bloqueia chaves AWS IAM (`AKIA...`), blocos de chaves privadas PEM (`BEGIN ... PRIVATE KEY`), chaves no formato `sk-...` e atribuições de segredos em `.env`/YAML.
* **Suporte Nativo a Clojure/EDN:** Como boa parte dos nossos sistemas em produção é escrita em Clojure, adicionei detecção específica para mapas e *keywords* qualificadas de EDN (`edn_secret_assignment`), barrando padrões como `:auth/token "..."`, `:db-password "..."` ou `:api-key "..."` caso um agente tente enviar um arquivo `config.edn` sensível no contexto.
* **Política de Caminhos Proibidos (`denied_paths`):** Bloqueia o envio de caminhos sensíveis (como `**/secrets/**` ou `*.key`) retornando `400 "request blocked: sensitive data detected (<kind>)"` — informando a categoria da regra acionada, mas nunca ecoando o segredo no log.
* **Escape Hatch Consciente por Invocação:** Quando um agente de infraestrutura confiável precisa legitimamente diagnosticar arquivos de configuração em uma tarefa pontual, o operador pode autorizar apenas aquela invocação via header `X-Bypass-Redact: 1` (vinculado a uma variável de ambiente efêmera na linha de comando), mantendo a barreira fechada para todo o resto.

---

## 🧬 A Ponte Go ↔ Clojure: Por Que Migrei Contratos e Configs para EDN + Malli

Uma das decisões de engenharia mais divertidas e recompensadoras do `small-router` foi unir a velocidade de um binário estático em **Go** com a expressividade de dados do ecossistema **Clojure**.

Por que fazer um gateway escrito em Go falar **EDN (Extensible Data Notation)** e validar contratos com **Malli**?

### 1. Densidade de Informação e Economia de 25% a 50% de Tokens
Quando agentes de IA ou ferramentas de diagnóstico consultam endpoints de telemetria (`GET /v1/sessions`, `GET /v1/summary`) ou leem arquivos de configuração e catálogos de modelos, formatos como JSON e OpenAPI cobram um "imposto sintático" pesado: aspas duplas repetidas em todas as chaves, dois-pontos, vírgulas e *escapes*.

Em **EDN**, chaves são *keywords* nativas (`:model`, `:cost-usd`, `:cached-tokens`), vírgulas são opcionais e comentários fazem parte da sintaxe. Na prática, o mesmo payload serializado em EDN consome **de 24% a 50% menos tokens e bytes** do que em JSON, sem perder absolutamente nenhuma informação estrutural.

### 2. Schemas como Dados Puros com Malli e Babashka (`bb validate`)
Em vez de manter centenas de linhas de JSON Schema ou especificações OpenAPI verbosas que nenhum agente quer ler inteiras, definimos todos os contratos canônicos do roteador em `schemas/*.edn` usando **Malli**:

```clojure
;; schemas/session.edn — Contrato canônico de telemetria de sessão (< 180 tokens!)
{:session-id
 [:re {:description "Identificador único da sessão (com ou sem prefixo proj-)"}
  "^(?:proj-)?[a-zA-Z0-9_.-]+$"]

 :session
 [:map
  [:session_id [:re "^(?:proj-)?[a-zA-Z0-9_.-]+$"]]
  [:model :string]
  [:provider :string]
  [:requests :int]
  [:ok :int]
  [:errors :int]
  [:input_tokens :int]
  [:cached_tokens :int]
  [:output_tokens :int]
  [:cost_usd number?]
  [:priced :boolean]
  [:peak_input :int]
  [:peak_window :int]
  [:filled :boolean]
  [:compressed :boolean]
  [:last_activity :string]
  [:created :string]]

 :sessions-response
 [:map
  [:sessions [:vector :session]]]}
```

Com o **Babashka (`bb`)**, validamos a configuração canônica (`configs/router.edn`), o catálogo de modelos e os contratos da API em **sub-segundos** (`mise run validate` / `bb validate`), sem o tempo de *startup* de uma JVM tradicional.

### 3. Negociação de Conteúdo Dual-Stack com Encoder EDN Zero-Dependência em Go
Para que o binário Go continuasse 100% livre de dependências externas pesadas, implementei o pacote `internal/edn` do zero usando reflexão em Go (com **98,9% de cobertura de testes**):
* **Leitura (`edn.Unmarshal`):** Faz o parse de arquivos `.edn` (incluindo a configuração canônica `configs/router.edn`), normalizando automaticamente *keywords* em `:kebab-case` para as tags `snake_case` das structs Go.
* **Escrita Determinística (`edn.Marshal`):** Serializa qualquer struct ou mapa Go em EDN com chaves ordenadas deterministicamente, respeitando tags `omitempty` e formatando timestamps em `RFC3339Nano`.
* **HTTP Dual-Stack (`Accept: application/edn`):** Se um cliente tradicional ou proxy OpenAI chama o `small-router`, ele recebe `application/json`. Se um script Babashka, serviço Clojure ou agente otimizado envia `Accept: application/edn`, o mesmo handler Go responde nativamente em EDN:

```bash
# Consumindo a telemetria do router em EDN direto num one-liner Babashka:
curl -s -H "Accept: application/edn" -H "Authorization: Bearer $ROUTER_KEY" \
  http://localhost:8081/v1/sessions \
  | bb -e '(let [{:keys [sessions]} (edn/read-string *in*)]
             (prn {:ativas (count sessions)
                   :custo-total (reduce + (map :cost_usd sessions))}))'
```

---

## 🖥️ Do Terminal ao Cockpit Nativo: Wails v2 + Svelte, SSE e Git Bridge

Um gateway de inferência para múltiplos agentes rodando em paralelo precisa responder a uma pergunta operacional simples em menos de um segundo: **"Qual janela de agente está gastando tokens agora, em qual branch do Git, e quão cheia está a janela de contexto dele?"**

Para isso, construímos três camadas de visibilidade sobre o motor do `small-router`:

1. **Isolamento de Sessões e *Fingerprinting* de Conversa (`internal/session`):**
   Quando você abre três terminais com agentes trabalhando no mesmo repositório, eles podem compartilhar o mesmo diretório de projeto. O `small-router` combina resolução multi-header (`X-Session-ID`, `X-Agent-Name`) com *fingerprinting* da conversa para isolar cada janela de agente em sua própria sessão, detectando automaticamente dois eventos críticos de ciclo de vida:
   * `context_high`: quando a sessão ultrapassa 80% da janela real do modelo (ex.: 210k de 262k tokens).
   * `context_compressed`: quando uma janela quase cheia sofre uma queda abrupta de tokens de entrada — sinalizando que o agente compactou o histórico (e, portanto, abandonou o *prefixo de prompt cache* anterior).
2. **Git Bridge (`internal/gitbridge`):**
   Sem tocar ou poluir o repositório Git corporativo, a ponte observa os metadados locais (`branch`, `commit`, `remote`), extrai automaticamente a chave da tarefa (ex.: `TASK-104` a partir de `feat/TASK-104-slurm`) e correlaciona cada turno de LLM — do *Architect* ao *Coder* e *Reviewer* — com o Pull Request correspondente. Pelo terminal, um simples comando mostra quantos turnos, quantos tokens em cache e quantos centavos de dólar aquela *feature branch* consumiu até o momento.
3. **Dashboard Web SSE (`embed`) + App Desktop Nativo em Wails v2 & Svelte (`desktop/`):**
   O binário do `small-router` traz embutido via `go:embed` uma SPA em modo escuro (`GET /dashboard`) alimentada em tempo real por **Server-Sent Events (`GET /v1/events`)** com latência inferior a 10ms após o término de cada stream, pré-carregada com as últimas 50 requisições do *ring-buffer*. E, para uso diário na estação de trabalho Linux, empacotamos o cockpit como um **aplicativo desktop nativo em Wails v2 + Svelte**, com controle dinâmico de escala/zoom persistido (150%/200% para monitores HiDPI), visão ao vivo das contas upstream ativas, gauge do orçamento diário e tabela de detecção de loops.

---

## 🏁 Conclusão: O Plano de Execução Como Vantagem Competitiva

Quando tratamos agentes de código como engenharia de sistemas de verdade — e não apenas como uma chave de API colada num plugin de IDE —, o gateway de inferência deixa de ser um mero repassador de pacotes HTTP.

Com o **`small-router`**, ganhamos:
* **Previsibilidade financeira:** teto diário rígido, *prompt caching* monitorado acima de 93% e reconciliação exata de faturas.
* **Continuidade operacional:** *circuit breakers* que desviam de quedas em segundos e um guardião de loops que salva o contexto do agente sem erros `502`.
* **Soberania e segurança:** barreira MR-019 ativa por padrão e logs 100% livres de código-fonte ou prompts.
* **Interoperabilidade Go + Clojure:** contratos formais em Malli/EDN que falam a língua nativa da nossa stack e economizam janela de contexto.

---

### 🔜 No Próximo Artigo da Série...

Se o `small-router` governa **como** os agentes falam com os modelos, ainda resta a pergunta que define a qualidade do raciocínio do modelo: **o que exatamente colocamos dentro da janela de contexto antes de apertar o gatilho?**

Na **[Parte 3 desta série](/blog/2026-10-22-context-graph-engine-engenharia-contexto-deterministica/)**, vamos abrir a caixa-preta do **`context-graph-engine`**: como transformamos repositórios em Go e Clojure em um grafo determinístico navegável com orçamento estrito de tokens — e o que os nossos benchmarks científicos A/B (`BEFORE` vs. `AFTER`) usando a telemetria real do `small-router` revelaram sobre o comportamento dos LLMs.

*Você pode explorar os diagramas interativos e a ficha técnica completa do projeto em [/trabalho/small-router/](/trabalho/small-router/) ou conversar com a **Rohana** no chat aqui do site sobre qualquer detalhe dessa arquitetura.*

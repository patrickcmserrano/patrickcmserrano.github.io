---
title: 'Engenharia de Contexto Determinística: Medindo o Impacto do context-graph-engine em Agentes de Código'
date: '2026-10-22'
tags: ['context-graph-engine', 'Go', 'Clojure', 'AI Factory', 'Benchmarks', 'LLM', 'Architecture']
summary: 'Como um indexador sintático determinístico em Go (sem LLM e sem embeddings) reduziu em 82% o custo, 97% as chamadas de ferramentas e 97% o tempo de parede de um agente de código em um repositório Clojure real — e o que as execuções que falharam nos ensinaram sobre contaminação de benchmarks.'
---

**Série AI Factory & Engenharia de Agentes — Parte 3 de 6**

Nos dois primeiros artigos desta série, percorremos a infraestrutura soberana da **[AI Factory sobre FreeBSD Jails, vLLM e Slurm](/blog/2026-10-22-ai-factory-privacidade-por-arquitetura/)** e o plano de execução do **[`small-router`](/blog/2026-10-22-small-router-gateway-go-contratos-edn-malli/)** (nosso gateway de inferência em Go com contratos em EDN/Malli).

Uma vez que o `small-router` passou a registrar a telemetria exata de cada turno de agente (tokens de entrada, *prompt cache*, chamadas de ferramentas, latência e custo em dólares), uma verdade incômoda saltou aos olhos nos logs: **um agente de código chamado para trabalhar num repositório não-familiar gasta a maior parte do seu orçamento apenas descobrindo o que o repositório é.**

Ele lista diretórios, dispara dezenas de `glob` e `grep`, abre arquivos irrelevantes, relê o mesmo arquivo duas ou três vezes e ainda invoca sub-agentes para resumir o que acabou de ler. Pior: **essa exploração é redescoberta do zero — e paga de novo — a cada nova sessão.**

A resposta padrão da indústria para isso costuma ser *"coloque um banco vetorial com embeddings do código"*. Eu segui o caminho oposto: construí o **`context-graph-engine` (`repo-index`)** usando exclusivamente a biblioteca padrão do **Go** — **sem LLM, sem embeddings e sem rede** — para extrair fatos determinísticos com proveniência exata e empacotar envelopes de contexto com prefixo estável. E, em seguida, medi cientificamente o antes e o depois (`BEFORE` vs. `AFTER`).

---

## 🧱 As Quatro Camadas (e Por Que Elas Nunca Devem Se Misturar)

O erro mais comum em ferramentas de contexto para IA é misturar **observação** com **heurística**. Quando um indexador tenta "adivinhar" o que é importante durante a varredura, você perde a capacidade de auditar por que um arquivo entrou ou ficou de fora do prompt.

No `context-graph-engine`, o pipeline é dividido em quatro camadas estritamente separadas:

```text
Repositório Git (Clojure / Go)
    │
    ▼  1. scan      ──▶ O que existe? (Fatos puros + proveniência de arquivo/linha)
  facts.json
    │
    ▼  2. graph     ──▶ Como as partes se relacionam? (Arestas de require/import/deps)
  graph.json
    │
    ▼  3. navigate  ──▶ O que esta tarefa específica precisa? (Política declarativa, sem LLM)
  subgraph
    │
    ▼  4. pack      ──▶ O que cabe no orçamento e em qual ordem? (Envelope com prefixo estável)
  envelope.txt ──▶ Entregue ao Agente de Código
```

| Camada | Pergunta que Responde | Onde Pode Errar |
| :--- | :--- | :--- |
| **1. Index (`scan` + `graph`)** | *O que existe no repositório?* | **Em nada** — é observação sintática pura com proveniência (`arquivo`, `linha`, `regra`). |
| **2. Navigation (`navigate`)** | *O que é relevante para esta tarefa?* | Na política declarada (que vive num perfil `.json` sobrescritível, nunca hardcoded no indexador). |
| **3. Pack (`pack`)** | *O que cabe fisicamente na janela?* | No orçamento de tokens (`budget-soft` / `budget-hard`) e na ordenação. |
| **4. Agent** | *O que fazer com o código?* | Na execução da tarefa de engenharia em si. |

Manter essas camadas separadas é o coração da ferramenta: uma convenção de nomenclatura como `*.core` é **política de navegação**, não fato. Todo nó selecionado pelo navegador carrega a regra exata que o selecionou e a aresta pela qual ele chegou até ali, com o arquivo e a linha de origem.

---

## 🔍 O Que o Motor Extrai (Go + Clojure Nativo, Zero Dependências)

Sem subir uma JVM, sem chamar `clj-kondo` externo e sem depender de bibliotecas de terceiros, o binário possui analisadores sintáticos próprios em Go (`internal/edn` e `internal/languages`) capazes de inspecionar repositórios mistos de **Clojure** e **Go** (incluindo a si mesmo via *self-hosting* com `make context`):

* **Clojure (`internal/edn` + analisador sintático):** Extrai `ns`, `:require`, `:as` (aliases), `:refer`, `def`/`defn`/`defmacro` públicos e *reader conditionals* (`#?(:clj ... :cljs ...)`), além de dependências e aliases do `deps.edn`.
* **Go:** Resolve o caminho de pacote a partir do `go.mod` mais próximo, extrai `import`s e declarações exportadas de topo.
* **Comandos Operacionais & CI:** Mapeia tarefas do `mise.toml`, `Makefile`, `package.json`, aliases do Clojure e passos `run:` de workflows de CI.
* **Escopo e Fronteiras de Segurança (`internal/scope`):** Classifica cada caminho como `repository`, `external`, `generated`, `cache` ou `ignored`. Árvores excluídas (como `.cpcache`, `node_modules` ou `target`) não são descartadas em silêncio: viram fatos auditáveis com a regra que as excluiu.

### Cinco Garantias Inegociáveis

1. **Determinismo Byte-a-Byte:** O mesmo estado de repositório produz artefatos (`facts.json`, `graph.json`, `manifest.json`) idênticos byte a byte. Zero timestamps variáveis, zero caminhos absolutos, zero IDs aleatórios — tudo ordenado lexicograficamente e testado escaneando cada fixture duas vezes e comparando os bytes.
2. **Fronteira de Segurança Inviolável:** Qualquer arquivo classificado como sensível (`.env`, `*.key`, `**/secrets/**`) **jamais é aberto em nenhuma camada** — nem mesmo se o operador pedir explicitamente ao *packer* para materializá-lo. Ele viaja no grafo apenas como metadado (`content_read: false`), e credenciais em URLs de remotes Git são expurgadas na leitura.
3. **Verificabilidade Criptográfica (`verify`):** O manifesto amarra o índice ao estado exato da árvore (`commit`, flag `dirty`, *tree fingerprint* e *digests* SHA-256 por artefato). O comando `repo-index verify` retorna `INDEX_INVALID` (código 3) se um artefato foi adulterado e `STALE_INDEX` (código 4) se o código-fonte avançou.
4. **Proteção Tripla Contra Escrita de Agentes (`protect`):** Fatos gerados, perfis de política e *baselines* de benchmark são protegidos contra edição acidental por agentes em três camadas independentes: permissões de sistema de arquivos (`0444` nos artefatos e `0555` no diretório — pois `rename` e `unlink` dependem da permissão do diretório, não do arquivo), um hook `PreToolUse` que barra a ferramenta com `WRITE_DENIED protected_artifact` (código 5) e regras de *deny* do projeto.

---

## 📊 O Experimento Científico: `BEFORE` vs. `AFTER`

Em vez de confiar na intuição de que *"o agente pareceu mais rápido"*, congelei um protocolo experimental rigoroso usando um serviço real de produção em Clojure (**112 arquivos-fonte, 1,17 MB**), o mesmo modelo (`qwen3.7-plus`) e exatamente o mesmo prompt pedindo um inventário completo de arquitetura, dependências, fluxos de trabalho, metadados de segurança, candidatos a Polylith e riscos — sem permissão de escrita.

### O Diagnóstico do `BEFORE` (Sem Índice de Contexto)

Quando o agente foi solto no repositório "a frio", a telemetria do `small-router` revelou dois ralos financeiros e de latência distintos:
1. **Explosão de Descoberta:** Do turno #1 para o turno #2, o consumo saltou de `731` para `40.369` tokens de entrada. Ao longo da sessão, o agente disparou **184 chamadas de ferramentas**: `108` leituras de arquivos (`read_file`) sobre `79` arquivos distintos — **relendo 29 arquivos mais de uma vez** — além de `39` `list_directory`, `17` `glob`, `10` `grep_search` e `4` sub-agentes.
2. **Instabilidade de Prefixo (*Prompt Cache Abandonment*):** Embora a taxa média de cache parecesse saudável (`70,9%`), apenas **5 requisições** onde o prefixo do prompt mudou custaram **41% de todos os tokens não-cacheados** da sessão inteira (incluindo uma única chamada no turno #38 que re-faturou `66.760` tokens a preço cheio).

### O Resultado Comparado (`BEFORE` vs. `AFTER` com Envelope Determinístico)

No `AFTER`, mudamos exatamente uma variável: entregamos ao agente o envelope pré-computado pelo `repo-index` para o perfil `architecture` (com prefixo estável, contendo o mapa estrutural do repositório e os 22 arquivos nucleares materializados com suas razões de seleção).

| Métrica Auditada | `BEFORE` (Descoberta a Frio) | `AFTER` (`repo-index` Envelope) | Impacto Real (Δ) |
| :--- | ---: | ---: | ---: |
| **Requisições ao LLM (Turnos)** | 39 | **3** | **−92%** |
| **Tokens de Entrada Totais** | 1.220.009 | **171.976** | **−86%** |
| **Tokens de Entrada Não-Cacheados** | 354.729 | **103.368** | **−71%** |
| **Tokens de Saída** | 50.735 | **5.028** | **−90%** |
| **Chamadas de Ferramentas (Total)** | **184** | **5** | **−97%** |
| **`read_file` (Leituras de Arquivo)** | 108 (29 releituras) | **0** | **−100%** |
| **`list_directory` / `grep` / `shell` / `sub-agent`** | 39 / 10 / 6 / 4 | **0 / 0 / 0 / 0** | **−100%** |
| **`glob` (Verificação Pontual)** | 17 | **5** | **−71%** |
| **Custo Total da Tarefa (USD)** | $0,2893 | **$0,0510** | **−82%** |
| **Tempo de Parede (*Wall Clock*)** | 1.194 s (~20 min) | **36 s** | **−97%** |

Olhe para a linha do `read_file`: **caiu de 108 leituras para zero.**
O agente no `AFTER` não precisou abrir nenhum arquivo para reconstruir mentalmente o repositório. Suas únicas 5 chamadas de ferramenta foram `glob`s cirúrgicos para confirmar se diretórios opcionais existiam (`test/**/*.clj`, `docs/adr/*.md`). E todas as **14 áreas técnicas** cobertas pelo `BEFORE` (Jetty, Datomic, Kafka, Qdrant, Slurm, interceptors, segurança, deploy, etc.) foram cobertas no relatório final do `AFTER` com 100% das afirmações ancoradas nos 22 arquivos do envelope.

---

## 🧪 O Que as 4 Tentativas que Falharam Antes do Benchmark Limpo Ensinaram

Em engenharia séria, os erros de medição durante a construção do experimento costumam ensinar mais do que o gráfico final. Antes de chegar à execução limpa do `AFTER`, quatro baterias preliminares foram invalidadas — e cada uma revelou uma armadilha clássica de quem avalia agentes de IA:

1. **Um pacote de contexto não é dado inerte — o modelo obedece ao que lê dentro dos arquivos:**
   Um dos 22 arquivos materializados dentro do envelope de arquitetura era o `AGENTS.md` do próprio repositório, que continha uma instrução antiga dizendo ao agente: *"Antes de explorar, leia `context/*.md`"*. Mesmo com o prompt do envelope dizendo que tudo já estava ali, **o modelo obedeceu à instrução que estava escrita dentro do arquivo `AGENTS.md` materializado** em três execuções seguidas! Lição: texto materializado no contexto é instrução ativa para um LLM; ou você demarca claramente as fronteiras de dados, ou alinha as instruções internas do repositório com o seu runtime.
2. **Uma resposta anterior esquecida na árvore invalida qualquer benchmark:**
   Numa das rodadas, uma execução anterior havia deixado uma pasta com 95 KB de relatórios gerados no disco. O agente no `AFTER` achou a pasta, leu os 7 documentos prontos e produziu um relatório brilhante — mas **estava apenas parafraseando a resposta pronta**, enquanto o `BEFORE` havia lido o código-fonte real. A comparação era assimétrica e cientificamente nula. Respostas anteriores precisam ser movidas para fora da árvore física antes de medir, não apenas "proibidas por prompt".
3. **Arquivos ignorados pelo Git não são estado do repositório:**
   Um servidor `nREPL` do Clojure reescrevendo `.nrepl-port` ou o cache de um linter invalidavam o *tree fingerprint* do índice em poucos minutos, porque o cálculo de integridade inicial caminhava por todos os arquivos do diretório. Corrigimos a camada `verify` para que arquivos ignorados pelo Git continuem registrados como fatos, mas nunca decidam se o índice do código-fonte ficou obsoleto (`STALE_INDEX`).
4. **É muito fácil conseguir "−80% de custo" fazendo o agente trabalhar menos:**
   Uma comparação ingênua contra uma sessão que havia abortado cedo mostrava `−80%` de custo e `−97%` de chamadas de ferramentas — números verdadeiros na aritmética e completamente inúteis na realidade. Por isso, o nosso `bench_report.py` agora audita automaticamente se a execução produziu uma fração desproporcional do output ou teve turnos insuficientes antes de declarar vitória.

---

## 🏁 Conclusão: Menos Adivinhação, Mais Engenharia

O ganho de **20 minutos para 36 segundos** e a queda de **82% no custo por tarefa concluída** não vieram de trocar para um modelo maior, nem de mágica de *prompt engineering*. Vieram de aplicar um princípio clássico de ciência da computação aos agentes de IA: **não recalcule de forma probabilística, a cada requisição, aquilo que pode ser extraído de forma determinística uma única vez.**

Hoje, esse mesmo padrão de envelopes gerados pelo `context-graph-engine` já alimenta nossos fluxos de trabalho no **[`TechSentry`](/trabalho/techsentry/)**, no **[`ark-streams`](/trabalho/ark-streams/)** e na nossa máquina de desenvolvimento.

---

### 🔜 No Próximo Artigo da Série...

Saindo dos bastidores da AI Factory e olhando para a superfície pública: na **[Parte 4 desta série](/blog/2026-10-22-sagittarius-a-webgl-rohana-agente-clojure/)**, vou abrir o código da experiência interativa que você está vendo neste próprio portfólio — como escrevi os shaders GLSL de *ray-marching* relativístico do buraco negro **Sagittarius A\***, a viagem interestelar de 26.670 anos-luz até a **visualização realista da Terra sincronizada em tempo real com os fusos horários (UTC)**, e como embuti a **[Rohana](/trabalho/rohana/)** (nosso motor conversacional em **Clojure + Pathom 3 + Turbovec**) para atender visitantes ao vivo 24/7.

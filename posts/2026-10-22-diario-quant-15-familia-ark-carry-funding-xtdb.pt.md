---
title: 'Diário Quant #15: Modularizando a Família Ark, Carry Condicional de Funding e Bitemporalidade no ark-engine'
date: '2026-10-22'
tags: ['Nexus Quant', 'Ark Streams', 'Ark Engine', 'Go', 'Clojure', 'XTDB', 'Quant', 'NATS JetStream']
summary: 'O fechamento da Sprint Jul/2026-D na Nexus Quant: a extração dos pacotes Go da Família Ark com golden fixtures, o paradoxo estatístico entre o Momentum Cross-Seccional (D04) e o Carry de Funding (D03) no holdout, e como aceleramos em 60% o ledger bitemporal do ark-engine em Clojure/XTDB.'
---

**Série AI Factory & Engenharia de Agentes — Parte 6 de 6**

Quando publiquei o [Diário de Dev #13 em 8 de julho de 2026](/blog/2026-07-08-dev-diary-ark-streams/), tínhamos acabado de consolidar uma descoberta dura na **Nexus Quant**: três famílias inteiras de estratégias (*AlligatorTrend 5m*, *Liquidation Cascade Fade* e *TSMOM Diário*) haviam morrido sob nossos critérios pré-registrados de validação *out-of-sample*, corroídas pela taxa *taker* de `0,12%` *round-trip*.

Naquele post, deixei registrada a especificação da **Sprint Jul/2026-D (*"Cortar o custo, ampliar o universo"*)**: desligar as instâncias *paper* legadas, instrumentar coletores de microestrutura de livro de ofertas (*Best Bid/Offer* e *basis* perp-spot) e testar duas teses de baixo giro com dados reais de *funding* — o **Carry Condicional de Funding (D03)** e o **Momentum Cross-Seccional Semanal (D04)**.

Neste sexto e último artigo da nossa série trimestral, apresento os resultados completos daquela sprint, a modularização arquitetural da **Família Ark** em Go e os benchmarks de armazenamento bitemporal do **[`ark-engine`](/trabalho/ark-engine/)** em **Clojure + Polylith + XTDB**.

---

## 🧩 Ato I: A Modularização da Família Ark e os Coletores de Microestrutura (D01 & D02)

À medida que o ecossistema quantitativo cresceu, manter contratos de eventos, clientes de corretora e indicadores matemáticos presos dentro de um único repositório monolítico começou a gerar atrito entre o motor de tempo real ([`ark-streams`](/trabalho/ark-streams/)), os binários de pesquisa offline e o terminal desktop.

Executamos uma cirurgia de desacoplamento em quatro frentes:

```text
                        ECOSSISTEMA FAMÍLIA ARK (Nexus Quant)
  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
  │    ark-protocol     │  │   ark-indicators    │  │      bitget-go      │
  │  (Contratos & DTOs  │  │ (SMMA, AO, AC, ATR, │  │ (REST v2 Assinado + │
  │  + Golden Fixtures) │  │  RSI, MACD Puros)   │  │  WebSocket Público/ │
  └──────────┬──────────┘  └──────────┬──────────┘  │  Privado + Spot/Perp│
             │                        │             └──────────┬──────────┘
             └────────────────────────┼────────────────────────┘
                                      ▼
       ┌────────────────────────────────────────────────────────────┐
       │             ark-streams (Go + NATS JetStream)              │
       │  • Coletores: Kline, Liq, Funding, OI, OKX BBO 1Hz, Spot   │
       │  • Motores: FractalEngine, AggressorEngine, RiskGuard (8x) │
       └──────────────┬──────────────────────────────┬──────────────┘
                      │                              │
                      ▼                              ▼
        ┌───────────────────────────┐  ┌───────────────────────────┐
        │   ark-terminal (v1.2.1)   │  │   ark-engine (Clojure)    │
        │ (Wails v2 + Svelte 5 GUI) │  │ (Polylith + Redis + XTDB) │
        └───────────────────────────┘  └───────────────────────────┘
```

1. **Extração com *Golden Fixtures* Compartilhadas:** Extraímos os módulos independentes **`ark-protocol`**, **`ark-indicators`** e **`bitget-go`**, validados por *golden fixtures* idênticas para garantir que o cálculo de um indicador ou o parse de um evento WebSocket produza exatamente o mesmo bit no backtester e no motor de produção.
2. **Do `nexus-desktop` ao [`ark-terminal` (`v1.2.1`)](/trabalho/ark-terminal/):** O cockpit desktop nativo em **Wails v2 + Svelte 5 + Lightweight Charts** ganhou identidade própria como `ark-terminal`, com empacotamento automatizado e conexão de baixa latência ao barramento NATS JetStream.
3. **Funeral Limpo da AlligatorTrend (D01):** Cumprindo a decisão da Sprint B, removemos do runtime de produção as **4 instâncias *paper*** da AlligatorTrend (`BTCUSDT`, `ETHUSDT`, `SOLUSDT` e `XAUUSDT`), mantendo o código em `internal/strategies/alligator_trend.go` apenas como referência histórica da interface de estratégias.
4. **Coletores de Microestrutura em Produção (D02):**
   Para atacar o custo de execução (avaliando *fill-rate* de ordens *post-only/maker* e a *basis* entre mercado futuro e à vista), colocamos três novos fluxos no ar sobre o **NATS JetStream**:
   * **Bid/Ask no Ticker da Bitget:** Extraímos `BidPx`, `AskPx`, `BidSz` e `AskSz` diretamente do canal de ticker já aberto, com custo zero de novas conexões.
   * **Coletor `bbo-tbt` na OKX Amostrado a 1 Hz (`BOOK_ARCHIVE`):** Consumimos o canal *tick-by-tick* de melhor oferta de compra/venda da OKX, amostramos a **1 Hz** ($\approx 86\text{ mil msgs/dia/símbolo}$, evitando inundar o disco com *ticks* crus de 10ms) e gravamos no mirror dedicado `BOOK_ARCHIVE` (8 GiB) com `SpreadBps` pré-calculado.
   * **Série Histórica de *Basis* Perp-Spot (`market.spot.ticker.BTCUSDT`):** Adicionamos o coletor do mercado *Spot* da Bitget em paralelo ao *Perp* para medir continuamente o prêmio/desconto do contrato perpétuo.

---

## 🔬 Ato II: O Paradoxo dos Dois Vereditos (D03 vs. D04)

Na pesquisa quantitativa da Nexus Quant, a regra de ouro (§10.6) é inegociável: **retorno calculado sobre o capital total, duas pernas de taxa *taker* (`0,06%` por perna), *funding* histórico real por janela de 8h (proibido usar taxa fixa de fallback), execução com defasagem realista em `close[t+1]`, estatísticas estritamente causais (*rolling*, zero *lookahead*) e critérios de aprovação escritos antes de tocar no período de *holdout* (`2025-01-01` a `2026-06-30`).**

Mais importante ainda: todo estudo exige a **decomposição aditiva do PnL** separando o que veio de **movimento de preço**, o que veio de **recebimento/pagamento de *funding*** e o que foi drenado por **taxas de execução (*fees*)**.

Foi exatamente essa decomposição que revelou uma simetria fascinante — e irônica — entre os estudos **D04** e **D03**.

### 1. Estudo D04 — Momentum Cross-Seccional Semanal: Veredito `FAIL` 🪦

A hipótese do **D04** era clássica da literatura quantitativa: em vez de operar tendência num único ativo (*time-series*), ranquear semanalmente os **20 contratos perpétuos USDT mais líquidos** (filtro causal de volume dólar *rolling* 30 dias sobre um painel de **528 símbolos** da Binance Futures entre 2019 e 2026), comprando os 4 mais fortes (*quintil superior*) e vendendo os 4 mais fracos (*quintil inferior*) em pernas casadas (*dollar-neutral*), com janela de retorno $L \in \{60, 90, 120\}$ dias e *skip* dos últimos 7 dias.

No *holdout* intocado (`2025-01` a `2026-06`), os números contaram uma história implacável:

| Critério Pré-Registrado (D04) | Resultado Medido | Meta Exigida | Status |
| :--- | ---: | ---: | :---: |
| **Retorno Líquido no Holdout** | `+5,33%` | `> 0%` | ✅ |
| **Correlação com BTC (Teste Anti-Beta)** | `0,034` | `< 0,30` | ✅ |
| **Max Drawdown OOS Agregado** | **`34,5%`** | `≤ 20,0%` | ❌ |
| **Sharpe Ratio OOS Agregado** | **`0,12`** | `≥ 0,50` | ❌ |
| **Estabilidade do Parâmetro $L$ nas Janelas** | **`3 / 5`** | `≥ 4 / 5` | ❌ |

A estratégia reprovou no *drawdown* (`34,5%`) e no Sharpe (`0,12`), sendo formalmente arquivada. Mas olhe para a **decomposição do PnL do holdout (`+5,33%` líquidos)**:
* **PnL Bruto de Preço (a tese de Momentum):** **`−1,16%`** (negativo!).
* **PnL de Funding Real Recebido:** **`+10,81%`**.

Ou seja: o ranking de momentum cross-seccional **não gerou alfa de preço nenhum** no holdout. O único motivo pelo qual o resultado líquido ficou positivo foi que a carteira *long/short* calhou, por acidente, de ficar posicionada a favor de quem recebia *funding*! Era um **carry trade acidental disfarçado de momentum**.

### 2. Estudo D03 — Carry Condicional de Funding: Veredito `PASS` (com Ressalva Crucial) ⚠️

No **D03**, testamos exatamente a tese oposta em `BTCUSDT` (**2.487 barras diárias** e **7.454 liquidações reais de *funding* de 8h**): entrar quando o *funding* acumulado de 3 dias ultrapassa o percentil extremo causal de 1 ano ($X \in \{75, 80, 85\}$) — operando *short* quando o mercado está super-alavancado na ponta comprada (pagando *funding* alto) e *long* quando está super-vendido —, mas **com um veto obrigatório de tendência (`close` a favor da `SMA50` diária)**, saída no retorno à mediana ou stop de `3×ATR(14)` e *vol-target* de 8% ao ano.

No *holdout* intocado (`2025-01` a `2026-06`), todas as três condições pré-registradas passaram simultaneamente:

| Critério Pré-Registrado (D03) | Resultado Medido | Meta Exigida | Status |
| :--- | ---: | ---: | :---: |
| **Retorno Líquido no Holdout** | **`+13,48%`** | `> 0%` | ✅ |
| **PnL de Funding Isolado no Holdout** | **`+0,09%`** | `> 0%` | ✅ |
| **Max Drawdown no Holdout** | **`2,71%`** | `≤ 12,0%` | ✅ |

Pela regra pré-registrada, o veredito formal é **PASS**. Porém, quando abrimos a decomposição do lucro de `+13,48%`:
* **PnL Direcional de Preço:** **`+13,16%`** (`99,3%` do lucro!).
* **PnL de Funding Isolado:** **`+0,09%`** (`0,7%` do lucro — menor que o próprio resíduo de *compounding* da série).

Perceba a ironia científica perfeita entre os dois estudos:
* No **D04 (Momentum)**, tentamos capturar **preço** e só ganhamos dinheiro por causa do **funding** (`+10,81%`).
* No **D03 (Carry de Funding)**, tentamos capturar **funding** e ganhamos `+13,48%` com drawdown mínimo (`2,71%`) quase inteiramente por causa do **preço** (porque o filtro de extremo de *funding* combinado com o veto da `SMA50` funcionou como um excelente seletor de *timing* de tendência com baixíssimo giro, evitando as taxas que mataram o TSMOM puro!).

A mesma disciplina científica que nos proíbe de ajustar parâmetros para forçar um `PASS` também nos proíbe de mudar a regra depois do jogo para forçar um `FAIL`. Portanto, registramos o **PASS formal do D03**, mas com a recomendação operacional explícita: **não alocar capital assumindo que é uma estratégia neutra de renda de funding** — ela é um filtro seletivo de tendência de baixo giro e deve ser tratada como tal na carteira.

---

## ⏳ Ato III: Acelerando o Ledger Bitemporal do `ark-engine` em 60% (Clojure + XTDB)

Na outra metade do nosso laboratório quantitativo está o **[`ark-engine`](/trabalho/ark-engine/)**, nosso motor em **Clojure** estruturado como um monorepo **Polylith** sobre **Redis Streams** (`Carmine`), validação **Malli**, testes generativos (`test.check`) e banco de dados bitemporal **XTDB (com RocksDB embarcado)**.

Por que usar um banco **bitemporal** em finanças quantitativas? Porque para auditar um backtest ou uma ordem real sem viés de *lookahead*, você precisa responder a duas perguntas independentes sobre qualquer ponto no passado:
1. ***Valid Time* (Tempo do Evento de Mercado):** Quando aquele candle ou *tick* realmente aconteceu na corretora?
2. ***Transaction Time* (Tempo de Conhecimento do Sistema):** Em que milissegundo exato o nosso motor tomou conhecimento daquele dado?

Em outubro, antes de carregar históricos massivos no `ark-engine`, instrumentei um *harness* determinístico para medir o custo real do caminho de escrita (`perform-backfill!`) gravando **50.000 candles de 1 minuto** ($\approx 34,7\text{ dias}$ de um par) no XTDB/RocksDB em NVMe.

### O Gargalo Inicial: 1 Transação por Candle

Na implementação original, a função `ingest-bar!` chamava `xt/submit-tx` individualmente dentro de um `doseq` sequencial. Para 50.000 candles, o XTDB gerava **50.000 transações independentes** — e como o log de transações (`tx-log`) grava $\sim 1,5\text{ KB}$ de metadados por transação, o diretório em disco inflou para **507 MB** ($\sim 10,6\text{ KB}$ por candle!), dominado por arquivos de *Write-Ahead Log (WAL)* não compactados.

### A Otimização: Coerção Prévia + Batching (`partition-all 500`) + `sync!`

Refatoramos os componentes Polylith `temporal-db` e `orchestrator`:
1. Validamos e coagimos todos os candles via **Malli** antes de abrir a transação (isolando qualquer mensagem inválida para a *Dead-Letter Queue* sem abortar o lote inteiro).
2. Criamos `ingest-bars!` agrupando a escrita com `partition-all 500` em uma única transação atômica do XTDB + `sync!` explícito.
3. Removemos o `sort-by` redundante em memória na leitura `get-history`, aproveitando a ordenação nativa `:order-by` do índice do XTDB.

| Métrica Medida (50.000 Candles 1m) | Antes (1 tx/candle) | Depois (Lotes de 500 + `sync!`) | Ganho Real (Δ) |
| :--- | ---: | ---: | ---: |
| **Transações submetidas ao XTDB** | 50.000 | **100** | **−500×** |
| **Tempo Total de Escrita (*Wall Time*)** | 8,707 s | **5,447 s** | **−37%** |
| **Throughput de Ingestão** | 5.742 candles/s | **9.179 candles/s** | **+60%** |
| **Latência por Candle** | 0,174 ms | **0,109 ms** | **−37%** |
| **Memória Heap Utilizada** | 388 MB | **337 MB** | **−13%** |
| **Espaço em Disco (`xtdb-data`)** | 507 MB (10,6 KB/c) | **395 MB (7,9 KB/c)** | **−22%** |

Além do ganho imediato de **+60% em throughput de escrita**, o benchmark de leitura (`get-history`) nos deu um diagnóstico valioso: buscar 5 documentos ou 250 documentos levava exatamente o mesmo tempo (`2,98 s`), provando que o custo de leitura não estava na serialização nem na ordenação em memória, e sim no *scan* do predicado composto `[:symbol :timeframe :doc-type]` antes da aplicação do `:limit` — guiando exatamente a nossa próxima otimização de chaves compostas no XTDB.

---

## 🏁 Epílogo da Série: 1.050+ Commits, Uma Única Filosofia

Chegamos ao fim desta série especial de 6 artigos (mais o [Diário de Dev #14](/blog/2026-10-22-dev-diary-retrospectiva-trimestral/) que abriu a retrospectiva). Olhando para trás, entre julho e outubro de 2026, construímos:

1. **[Artigo #1 — AI Factory (Ping Hai)](/blog/2026-10-22-ai-factory-privacidade-por-arquitetura/):** Uma plataforma soberana de IA corporativa em FreeBSD Jails, WireGuard, ZFS criptografado, Slurm e vLLM, validada por 722 testes e 33 vídeos de prova executável.
2. **[Artigo #2 — `small-router`](/blog/2026-10-22-small-router-gateway-go-contratos-edn-malli/):** Um gateway de inferência e cockpit desktop em Go + Wails/Svelte com *circuit breakers*, parada graciosa de loops degenerados e contratos em EDN/Malli.
3. **[Artigo #3 — `context-graph-engine`](/blog/2026-10-22-context-graph-engine-engenharia-contexto-deterministica/):** Um indexador determinístico em Go que cortou em 82% o custo e em 97% o tempo de descoberta de agentes de código em repositórios reais.
4. **[Artigo #4 — Sagittarius A\*, Terra em Tempo Real & Rohana](/blog/2026-10-22-sagittarius-a-webgl-rohana-agente-clojure/):** Simulação astrofísica relativística e atmosférica em WebGL/GLSL no browser, narração em voz por seção e um motor conversacional Clojure multi-tenant (Daelaam) operando ao vivo no site e no mercado.
5. **[Artigo #5 — `TechSentry`](/blog/2026-10-22-techsentry-scraping-sobrevivencia-clojure-terrenos-leiloes/):** Garimpo multi-vertical em Clojure + Datahike + Pathom 3 mapeando 19.528 terrenos no RJ, leilões de carros e iPhones na madrugada.
6. **Artigo #6 — Família Ark & `ark-engine` (Nexus Quant):** Pesquisa quantitativa pré-registrada sem concessões ao *overfitting* e engenharia bitemporal em Go e Clojure/XTDB.

Linguagens e domínios variam — de jaulas no kernel do FreeBSD a shaders GLSL, de grafos Pathom em Clojure a microsserviços em Go —, mas o fio condutor é sempre o mesmo: **sistemas determinísticos, medições honestas, privacidade por construção e código que aguenta o mundo real.**

Obrigado por acompanhar até aqui — e nos vemos nos próximos commits!

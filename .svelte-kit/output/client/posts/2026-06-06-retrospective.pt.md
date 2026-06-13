# Relatório Retroativo Semanal (Período: 01/06 a 07/06/2026)

Este relatório compõe a retrospectiva das atividades de engenharia e entregas de **Patrick Serrano** na semana anterior (01 de Junho a 07 de Junho de 2026). O período foi marcado por avanços massivos no repositório **`dealer`** (criação de pipelines e monitors de nicho no Clojure) e consolidação da infraestrutura e suporte mobile no **`ark-streams`** (Go).

---

## 📊 Resumo das Entregas (Semana Anterior)

| Repositório | Atividade Principal | Escopo Técnico |
| :--- | :--- | :--- |
| **`ark-streams`** | Hardening de VPS e Suporte Mobile | Docker multi-stage, healthchecks, JetStream permanent archiving e Capacitor API Bridge. |
| **`dealer`** | Pipeline de Análise AliExpress | Modelagem de SKUs, Malli validation, Pathom parsing e documentação de novos nichos. |
| **`dealer`** | Chevrolet Vectra RJ Monitor | Scrapers OLX isolados, controle de cookies persistentes (bypass Cloudflare) e UI ClojureScript. |
| **`dealer`** | Orquestração & Scheduling | Unificação do scheduler de tarefas e dashboard de monitoramento de execução. |

---

## 🏗️ Detalhamento por Projeto

### 1. Projeto: `ark-streams` (Go Backend & Mobile Bridge)
O trabalho concentrou-se em preparar o sistema de trading para deploy real em servidores Cloud e habilitar a comunicação nativa em dispositivos móveis.

#### A. Hardening de Ops para Produção (VPS Oracle ARM)
- **Deployment robusto:** Criação de arquivo `.env.example`, docker-compose com healthchecks de dependências e refatoração da API Go para receber variáveis dinâmicas de ambiente.
- **Docker Multi-Stage:** Otimização de compilação contêiner em imagem enxuta ARM64 baseada no Alpine Linux.

#### B. JetStream Permanente e Capacitor
- **Arquivo Permanente:** Configuração de histórico infinito no JetStream para persistência de agressões e liquidações (`4230f49`).
- **Capacitor Mobile:** Inclusão de suporte à compilação Capacitor no frontend Svelte e adaptação do `apiBridge.ts` para tolerar transições de transporte (IPC/REST/WS) de forma transparente.

---

### 2. Projeto: `dealer` (TechSentry — Clojure Scrapers & Monitors)
Semana de altíssima produtividade com a criação de novos fluxos de monitoramento, pipelines de dados estruturados e bypasses avançados de scraping.

#### A. Pipeline de Nichos do AliExpress (Mouses e Teclados)
- **Modelagem de Dados:** Criação de pipeline estruturado usando schemas **Malli** para validação e parsers **Pathom** para enriquecimento de dados de busca.
- **Normalização de SKUs:** Implementação de inferência de SKU canônico para analisar concorrência e variações de preços de forma uniforme.
- **Nicho de Teclados Mecânicos:** Implementação completa da coleta de teclados baseando-se nas regras de negócio escritas no [aliexpress-niche-runbook.md](file:///home/patricks/dev/dealer/docs/aliexpress-niche-runbook.md).
- **Métricas Avançadas:** Captura de volumes reais de transações (`real_trade_count`), flag de produtos com frete Choice (`isChoice`), data de listagem e badges de top sellers.

#### B. Monitor Especializado Chevrolet Vectra RJ
- **Monitoramento de Oportunidades:** Criação de um pipeline isolado para buscar anúncios de Chevrolet Vectra no estado do Rio de Janeiro.
- **UI Interativa em ClojureScript:** Desenvolvimento de relatórios ricos com filtros em tempo real executados diretamente no client-side para o operador de compras de veículos.
- **Shared Cooldown OLX:** Implementação de um wrapper de controle de concorrência e atrasos (cooldown) compartilhado entre pipelines para evitar o banimento de requisições pela API da OLX.

#### C. Bypasses de Anti-Detecção (Cloudflare OLX)
> [!IMPORTANT]
> A OLX aumentou a rigidez de segurança temporariamente no início de junho de 2026, exigindo novos métodos de evasão de bots.

- **Warmup de Páginas:** Implementação de etapa de "warmup" carregando páginas neutras/comuns no Chromium antes de disparar o crawler nos alvos principais.
- **Perfis de Cookies Persistentes:** Refatoração de scrapers para carregar perfis de usuários persistentes ("lite" profiles contendo Cookies e Local State estruturados) para acumular reputação de navegação e burlar a barreira Cloudflare em todos os scrapers OLX.
- **Fallback Browser:** Lógica híbrida que tenta extração ultra-rápida via HTTP cru, com fallback instantâneo abrindo o Chromium controlado quando o status 403 (Forbidden) é detectado.

---

## 📜 Registro Completo de Commits (01/06 a 07/06/2026)

### Repositório: `ark-streams`
* `4230f49` - **feat(archive+mobile):** permanent liquidation/aggression archive and Capacitor mobile support.
* `9cdd961` - **feat(ops):** harden for production VPS deployment on Oracle Cloud ARM.

### Repositório: `dealer`
* `3bb0624d` - **feat:** unified scheduler, health dashboard, and vectra fix.
* `73ae740f` - **fix:** usar perfil lite (Cookies + Local State) em vez do perfil real completo.
* `0fb9c868` - **fix:** usar perfil real do Chrome para bypass Cloudflare OLX.
* `3616475a` - **refactor:** enriquecimento Vectra via Chrome perfil persistente.
* `fe7879fa` - **feat:** AliExpress niche pipeline — mouses, teclados, análise de mercado.
* `527d9174` - **feat:** nicho Teclados Mecânicos seguindo o runbook.
* `f8a84ee4` - **docs:** runbook para adicionar novos nichos AliExpress.
* `2a3fcc50` - **feat:** rastrear indisponibilidade de listings AliExpress no rescan.
* `8df01bfa` - **feat:** real_trade_count, isChoice, listed-at, top-seller no AliExpress.
* `46d6d4fa` - **feat:** infer canonical-sku para análise de mercado AliExpress.
* `157eb58b` - **feat:** AliExpress enrichment — Malli/Pathom pipeline, rating/trade/DPI filter.
* `2d62b4d0` - **feat:** AliExpress niche — scraper, normalizer, report, CLJS UI.
* `48212249` - **feat:** implement Vectra RJ monitor, interactive CLJS UI, and CI cleanup.
* `583dc198` - **docs:** sessão 2026-06-02 — Vectra RJ Monitor.
* `afdf875e` - **fix:** warmup em página neutra + corrige open-browser sem doto.
* `889aebe4` - **feat:** enriquecimento via HTTP simples com fallback browser.
* `88d7ed19` - **feat:** build CLJS por nicho via shadow-cljs :niches.
* `fc145802` - **fix:** anti-detecção Cloudflare em todos os scrapers OLX.
* `b68c65a8` - **feat:** pipeline vectra isolado + cooldown OLX compartilhado.
* `57af955e` - **feat:** vectra report com dados de detalhe + script de enriquecimento.
* `6219f7fc` - **feat:** vectra RJ monitor com filtros client-side + pipeline isolation.
* `72e4c4bb` - **refactor:** improve Vectra report with time tracking and premium UI.
* `73fd319a` - **feat:** implement specialized Chevrolet Vectra RJ monitor report.

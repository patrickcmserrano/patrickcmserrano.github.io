---
title: 'Scraping de Sobrevivência com Clojure: Garimpando 19.528 Terrenos, Leilões e iPhones no TechSentry'
date: '2026-10-22'
tags: ['TechSentry', 'Clojure', 'Datahike', 'Pathom 3', 'Scraping', 'Real Estate', 'Architecture']
summary: 'Como transformamos o TechSentry em uma plataforma multi-vertical de inteligência de ativos físicos em Clojure + Datahike + Pathom 3: contornando filtros silenciosos da OLX para mapear 19.528 terrenos no RJ, filtrando carros de leilão e caçando iPhones na madrugada com systemd.'
---

**Série AI Factory & Engenharia de Agentes — Parte 5 de 6**

Quem trabalha apenas com APIs REST bem comportadas e documentadas em OpenAPI costuma ter uma visão romântica sobre engenharia de dados. Mas quando o seu objetivo é encontrar **assimetrias reais de preço no mercado físico** — terrenos urbanos e rurais abaixo da mediana do metro quadrado, carros até R$ 30 mil ou lotes de leilão no Rio de Janeiro, e iPhones ou MacBooks cadastrados na categoria errada —, não existe API limpa esperando por você.

Existe o mundo real dos classificados online: paginações que param de funcionar silenciosamente na página 100, parâmetros de URL que o servidor finge que aplicou mas ignora por completo, anúncios de Miami em dólar infiltrados em buscas de Niterói, vendedores que anunciam `"13 Pro Max 256gb"` dentro da categoria de notebooks e bloqueios agressivos de IP para qualquer requisição vinda de data centers em nuvem.

Nos últimos meses (**57 commits** intensos em outubro), evoluí o **[`TechSentry`](/trabalho/techsentry/)** de um monitor de hardware para uma plataforma completa de garimpo e inteligência multi-vertical escrita em **Clojure 1.12**, **Datahike**, **Pathom 3**, **Etaoin** e **ClojureScript/Reagent**. Neste artigo, conto os bastidores técnicos das três missões mais desafiadoras dessa temporada.

---

## 🏗️ A Arquitetura de Sobrevivência do `TechSentry`

Antes de falar de cada vertical, vale entender por que o `TechSentry` não usa bancos relacionais pesados nem roda seus coletores de navegador em servidores na AWS ou DigitalOcean:

```text
Fontes do Mundo Real (OLX, Facebook Marketplace, Leilões, Level Micro)
       │
       │  Etaoin (Chromium Local c/ Perfil Real) + clj-http / jsoup
       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        TECHSENTRY ENGINE (Clojure 1.12)                    │
│                                                                            │
│  1. Normalização Defensiva ──▶ Extração de Área/Preço/Câmbio/Moeda/UF      │
│  2. Classificadores (.cljc)──▶ Urbano×Rural, Filtro Anti-Sucata, iPhone NLP│
│  3. Grafo Pathom 3         ──▶ Resolução Declarativa (:listing/r$-por-m2)  │
│  4. Diff & Expiração       ──▶ :listing/new | :price-changed | :unavailable│
│  5. Persistência Isolada   ──▶ Datahike (data/terrenos/db, data/cars/db)   │
└──────────────┬───────────────────────────────────────────────┬─────────────┘
               │                                               │
               ▼                                               ▼
   DASHBOARDS ESTÁTICOS + MAPAS LEAFLET            ALERTAS CIRÚRGICOS (Telegram)
   • public/terrenos.html (19.528 lotes RJ)        • Apenas watches canônicos (:notify? true)
   • public/cars.html & public/canonicos.html      • Execução 04h/12h/20h via systemd + flock
```

Três regras operacionais sustentam o sistema:
1. **IP Residencial Local > Nuvem para Browser Scraping:** Plataformas como OLX e Facebook Marketplace bloqueiam IPs de data center em minutos. Por decisão arquitetural, os workers de navegador rodam exclusivamente na máquina local via *timers* do `systemd --user` (`04:00`, `12:00`, `20:00`) protegidos por `flock` (garantindo um único escritor por vez), enquanto o GitHub Actions e o GitHub Pages atuam como camada estática *read-only* de publicação.
2. **Bancos Datahike Isolados por Vertical:** Para evitar que uma campanha massiva de imóveis de 20 mil registros dispute lock ou infle o snapshot do monitor de notebooks e carros, separamos os stores transacionais do **Datahike** por domínio (`data/terrenos/db`, `data/cars/db`, `data/db`), orquestrados pela CLI unificada `./bin/techsentry` (`v2026.10.21`).
3. **Arquivado $\neq$ Indisponível:** Quando encerramos ou mudamos o recorte de uma campanha, nunca apagamos dados do Datahike. Marcamos `:listing/archived-at` (decisão nossa, que preserva o histórico de preços para cálculo de medianas), mantendo-o estritamente separado de `:listing/unavailable-at` (quando nosso verificador `verify-canonical!` confirma `HTTP 410` ou remoção real do anúncio na plataforma).

---

## 🗺️ Missão 1: 19.528 Terrenos no RJ e as Duas Armadilhas Silenciosas da OLX

Em outubro, iniciei a **Missão Terrenos (T1 a T6)**: construir um dataset completo de todos os terrenos (urbanos/residenciais e rurais/chácaras/sítios) à venda no estado do Rio de Janeiro para calcular a **mediana real de preço e de $\text{R\$}/\text{m}^2$ por município, bairro e faixa de área**.

Logo nas primeiras sondagens, encontramos duas armadilhas clássicas de engenharia reversa:

### Armadilha 1: O Nó de Cidade Fantasma na URL
Na árvore de categorias da OLX, quando você navega para `imoveis/terrenos` e adiciona um sub-nó de cidade ou região na URL, **a plataforma ignora silenciosamente o filtro geográfico** e devolve terrenos do estado inteiro misturados — ou, pior, quando você usa busca textual (`?q=terreno`), ela mistura casas, apartamentos e até anúncios de outros estados.
* **Como resolvemos:** Abandonamos a busca por cidade na URL e passamos a varrer a categoria pura `imoveis/terrenos` em nível estadual, extraindo e validando a **UF e o município reais diretamente da estrutura canônica da URL e dos metadados de cada card** (`__NEXT_DATA__`), descartando qualquer infiltração de fora do RJ.

### Armadilha 2: O Teto Invisível dos 5.000 Resultados
A busca estadual do Rio de Janeiro declarava **37.831 terrenos**, mas a paginação da OLX trava em **100 páginas de 50 anúncios (~5.000 resultados)**. Qualquer tentativa de paginar além disso simplesmente repete ou corta o restante do mercado.
* **Como resolvemos (Fatiamento por Faixas de Preço + Gravação Incremental):**
  Dividimos a varredura estadual em **7 faixas de preço disjuntas (`?ps=&pe=`)**, dimensionadas para que cada fatia ficasse abaixo do teto de paginação. Além disso, reescrevemos o coletor para **gravar no Datahike em lotes a cada página com retomada automática** — se o processo Chromium engasgar na página 74 da faixa 4, a próxima execução retoma exatamente de onde parou, sem perder um único registro em memória.

### Do Dado Bruto à Inteligência Geoespacial (`public/terrenos.html`)

Ao final das etapas T1–T6, consolidamos no Datahike **19.528 terrenos únicos no estado do Rio de Janeiro**, cobrindo **119 municípios** (`100% UF=RJ`, com snapshots 1:1):
1. **Classificação Urbano × Rural:** Desenvolvemos um classificador em Clojure que separa lotes residenciais urbanos de áreas rurais (sítios, chácaras, fazendas, menções a hectares/alqueires, nascentes, pasto, ITR/INCRA) e normaliza medidas de área heterogêneas para $\text{m}^2$.
2. **Buckets de Mercado e Mediana de $\text{R\$}/\text{m}^2$:** Definimos chaves canônicas por município, tipo e faixa de metragem para calcular a mediana robusta (imune aos *outliers* de anúncios com preço `R$ 1` ou `R$ 999.999.999`).
3. **Mapa Interativo Camada 1 (e a Migração de Tiles):** Geocodificamos os municípios em `docs/terrenos-geo.edn` e geramos o painel `public/terrenos.html` com mapa **Leaflet** onde cada cidade é plotada com raio proporcional ao volume de ofertas e cor graduada pelo $\text{R\$}/\text{m}^2$ mediano. Quando o servidor padrão do OpenStreetMap começou a bloquear requisições de clientes locais e a CARTO passou a exigir chave de API comercial, migramos a camada base para os servidores públicos do **OpenStreetMap Alemão (`tile.openstreetmap.de`)**, restaurando o carregamento instantâneo do mapa sem dependências proprietárias.

---

## 🚗 Missão 2: Carros até R$ 30k e Leilões — Filtrando o Ruído do Mundo Real

Na vertical automotiva (focada em Niterói, São Gonçalo e Região Metropolitana do RJ), adicionamos o monitoramento de **pátios de leilão de veículos** e refinamos pesadamente o pipeline de **carros usados até R$ 30.000**.

Qualquer pessoa que já tentou automatizar buscas no Facebook Marketplace ou na OLX sabe que os anúncios mais "baratos" quase nunca são carros reais prontos para rodar. Sem higienização rigorosa, o topo do seu ranking é imediatamente poluído por quatro categorias de lixo:
1. **O "Ágio / Entrada" disfarçado de preço à vista:** O vendedor anuncia um carro de R$ 55.000 por `R$ 12.000` no campo de preço e escreve na descrição *"R$ 12 mil de entrada + 48x"*.
2. **Sucatas, Batidos e "Só para Rodar / Baixado Detran":** Carros sinistrados, vendidos apenas para retirada de peças, com motor fundido ou documentação irrecuperável.
3. **Infiltração Internacional no Facebook Marketplace:** Ao varrer o Facebook Marketplace com sessão real, o algoritmo frequentemente injeta anúncios dos Estados Unidos ou do Paraguai (preços em `USD` ou `PYG`, odômetros em milhas, menções a *clean title* / *rebuilt title* / *salvage*).

Para blindar o ranking (`src/tech_sentry/source/olx/cars/` e `categorizer.cljc`):
* Construímos filtros léxicos e estruturais em Clojure que detectam e expurgam menções a sucata, leilão de monta irrekuperável, financiamento oculto e termos em inglês/espanhol (*rebuilt title*, *down payment*, *miles*).
* Adicionamos normalização cambial explícita (`TECHSENTRY_FX_USD_BRL` / `TECHSENTRY_FX_PYG_BRL`) para campanhas que cruzam fronteiras e isolamos o banco de veículos em `data/cars/db`.
* Criamos o pipeline dedicado de **leilões**, separando claramente oportunidades de leilão (onde o desconto sobre a FIPE compensa o risco calculado) dos carros de particular prontos para transferência imediata.

---

## 📱 Missão 3: Caçando iPhones às 04:00 da Manhã (Mesmo na Categoria Errada)

A terceira frente de outubro foi automatizar a captura de oportunidades em smartphones Apple com um worker dedicado (`techsentry-iphone.timer`) disparado pelo `systemd` todos os dias às **04:00 da madrugada** — o horário em que a concorrência dorme e os anúncios recém-publicados na noite anterior ainda estão disponíveis.

Aqui, a engenharia em `src/tech_sentry/niche/iphone.cljc` precisou resolver um comportamento humano curioso: **as melhores oportunidades de compra frequentemente estão em anúncios mal catalogados pelo vendedor.**
* **Omissão da marca:** Muitos vendedores escrevem apenas `"13 Pro Max 256gb bateria 89% caixa e nota"` — sem digitar a palavra `"iPhone"` em lugar nenhum do título.
* **Erro de categoria:** Não é raro encontrar um iPhone anunciado por engano dentro da categoria de **MacBooks / Notebooks** (ou um acessório/capa anunciado pelo preço de um aparelho, e vice-versa).

Nosso classificador em `.cljc` (compartilhado entre o backend Clojure e o frontend ClojureScript) analisa a combinação de sufixos de modelo (`11`, `12`, `13`, `14`, `15`, `16` + `Pro` / `Pro Max` / `Plus` / `Mini`), capacidades de armazenamento (`64GB` a `1TB`), saúde de bateria e palavras-gatilho negativas (como `"troco tela"`, `"icloud bloqueado"`, `"apenas caixa"`, `"capinha"`), resgatando aparelhos legítimos que caíram na categoria de computadores e descartando peças ou aparelhos bloqueados antes de gerar o alerta.

---

## 🏁 Conclusão: Dados Limpos São o Verdadeiro Fosso Competitivo

Em mercados descentralizados e barulhentos como imóveis e veículos usados, **ter um LLM não resolve nada se o seu dado de entrada estiver sujo ou truncado na página 100**.

A combinação de **Clojure** (imutabilidade e manipulação expressiva de mapas de dados), **Pathom 3** (derivação declarativa de atributos como $\text{R\$}/\text{m}^2$ e scores de oportunidade) e **Datahike** (histórico transacional local em disco) provou ser uma arma formidável para transformar páginas caóticas da web em bases de dados auditáveis e acionáveis.

---

### 🔜 No Sexto e Último Artigo da Série...

Na **[Parte 6 desta série (Diário Quant #15)](/blog/2026-10-22-diario-quant-15-familia-ark-carry-funding-xtdb/)**, fechamos a nossa jornada trimestral voltando à **Nexus Quant** e à **Família Ark**: o desligamento formal da estratégia AlligatorTrend em *paper*, a modularização dos pacotes Go (`ark-protocol`, `bitget-go`, `ark-indicators`), os vereditos estatísticos completos do **Momentum Cross-Seccional Semanal (D04)** e do **Carry Condicional de Funding (D03)**, e como aceleramos em **60%** a escrita bitemporal do **[`ark-engine`](/trabalho/ark-engine/)** sobre **XTDB + RocksDB**.

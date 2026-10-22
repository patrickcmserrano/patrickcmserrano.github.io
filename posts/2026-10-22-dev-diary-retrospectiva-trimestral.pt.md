# Diário de Dev #14 — 1.050+ Commits Depois: Da AI Factory em FreeBSD ao Sagittarius A* e o Roteiro dos Próximos Artigos

*Período: 08 de Julho a 22 de Outubro de 2026*

Se você acompanha este blog, deve ter notado um silêncio de pouco mais de três meses desde o [Diário de Dev #13](/blog/2026-07-08-dev-diary-ark-streams/). O motivo não foi pausa — foi exatamente o oposto. Entre **08 de julho e 22 de outubro de 2026**, concentrei **1.054 commits autorais** distribuídos em **15 repositórios** entre o GitHub e minha forja privada na Neotek.

Nesse trimestre, saí do laboratório para colocar produtos reais em produção sob três marcas distintas (**Ping Hai**, **Daelaam** e **Nexus Quant**), construí motores próprios de roteamento de inferência e grafos de contexto determinísticos para agentes de código, escalei o **TechSentry** para dezenas de milhares de ativos monitorados no mundo físico e reconstruí a experiência deste próprio site — agora orbitando uma simulação relativística de **Sagittarius A\*** e com a **Rohana** atendendo ao vivo no canto da tela.

Este post cumpre dois papéis:
1. **Prestar contas da engenharia realizada nesses 106 dias**, consolidando os números, as arquiteturas e as decisões de trincheira de cada frente.
2. **Apresentar o mapa da nova série de artigos técnicos (Deep-Dives)** que publicarei na sequência, abrindo a caixa-preta de cada um desses sistemas.

---

## 📊 O Trimestre em Números (08/07 a 22/10/2026)

Cruzando a auditoria multi-forja (que inclusive agora está visível na [Home](/) no gráfico de densidade de repositórios) com os logs locais das últimas semanas, a distribuição de esforço ficou assim:

| Frente / Repositório | Commits Autorais | Forja | Escopo Principal no Período |
| :--- | :---: | :---: | :--- |
| **`dev-machine` + `pinha`** *(Ping Hai)* | **711** *(393 + 318)* | Neotek | Infraestrutura FreeBSD/Jails, malha WireGuard, SSO Keycloak/LDAP, vLLM sob Slurm e entrega da **AI Factory** em produção. |
| **`small-router`** *(Ping Hai)* | **100** | Neotek | Gateway de inferência *provider-agnostic* em Go compatível com OpenAI, schemas Malli/EDN, circuit breaker e console Wails v2. |
| **`Rohana`** *(Daelaam)* | **91** | GitHub | Rebranding `Khala` → `Rohana`, motor multi-tenant em Clojure (Pathom 3 + Turbovec + Presidio), red-team de guardrails e GTM real. |
| **`TechSentry`** | **57** | GitHub | Dataset de **19.528 terrenos no RJ**, mapa interativo OSM, pipelines de leilões/carros (RJ/SG/Niterói) e worker de iPhones. |
| **`patrickcmserrano.github.io` + `blackhole`** | **34** *(33 + 1)* | GitHub | Ray-marching relativístico de Sagittarius A\* com mapa galáctico da NASA, widget da Rohana, resgate histórico Moleque de Ideias (2018–2025). |
| **`context-graph-engine`** | **24** | Neotek | Indexador determinístico de grafos de repositório, *Context Packer v2* com orçamento de tokens e benchmark A/B em agentes. |
| **Família Ark** (`ark-streams`, `ark-terminal`, `ark-engine`) | **21** *(13 + 6 + 2)* | GitHub | Fechamento da Sprint D, extração de `ark-protocol`/`bitget-go`/`ark-indicators`, desligamento da AlligatorTrend e batch writes no XTDB. |
| **`qwen-settings`, `resume`, `kb` e outros** | **16** | Ambos | Automação de agentes, currículo sincronizado e base de conhecimento arquitetural. |

---

## 🏛️ Ato I: Ping Hai & AI Factory — Privacidade Não é Política, é Arquitetura

A maior fatia de engenharia do trimestre (**711 commits** somando `dev-machine` e o monorepo `pinha`) foi dedicada a tirar do papel e colocar em produção a **[AI Factory](/trabalho/ai-factory/)** sob a marca **Ping Hai**.

O problema que resolvemos é direto: empresas querem que suas equipes conversem com seus próprios documentos em português, mas não podem enviar contratos, prontuários ou propriedade intelectual para a API pública de terceiros. A tese que guia o projeto é simples de enunciar e dura de implementar: **em IA corporativa, privacidade não é promessa de termos de uso — é o desenho físico do sistema.**

* **Isolamento em FreeBSD Jails e Malha WireGuard:** Toda a operação roda sobre FreeBSD com jaulas isoladas por função (`openwebui-jail`, `small-pine-jail`, `openterminal-jail`, `nexus-gateway`), interconectadas por túneis WireGuard (`neotek.wg`) e provisionadas via OpenTofu e Ansible.
* **Identidade Federada Zero-Atrito:** O login utiliza o diretório que a instituição já possui (**Keycloak** federando **OpenLDAP** com PKI própria), provisionando contas automaticamente sem senhas paralelas.
* **Sanitização Pré-Vetor e Quarentena Criptografada:** Antes que qualquer PDF ou documento vire vetor no `pgvector` (busca híbrida semântica + lexical em português), o conteúdo passa pelo **Presidio**. Dados sensíveis (PII) são removidos antes da indexação; documentos que falham na revisão vão para quarentena criptografada e jamais tocam o índice. Nem mesmo o administrador lê o conteúdo das conversas pelo produto — a auditoria registra *quem fez o quê*, nunca o texto.
* **Frota Própria de GPUs (vLLM sob Slurm):** Os modelos rodam nas GPUs da instituição (`spark01`/`spark02` com RoCE), orquestrados via **vLLM sob Slurm**, incluindo modelos de código (`qwen3-coder-30b`, `qwen3-coder-next-nvfp4`) e transcrição de áudio (`whisper-large-v3`), além de telemetria em tempo real do custo real da infraestrutura computacional.

---

## ⚡ Ato II: `small-router` — O Plano de Execução em Go + Contratos em EDN/Malli

Para governar as chamadas de inferência tanto da AI Factory quanto dos meus próprios agentes de código, construí do zero o **[small-router](/trabalho/small-router/)** (**100 commits** entre agosto e setembro).

Em vez de espalhar chaves de API pelos clientes ou acoplar ferramentas a um único fornecedor, o `small-router` expõe um único endpoint compatível com OpenAI (`POST /v1/chat/completions`) à frente da frota própria de GPUs e de provedores serverless (Fireworks, DeepInfra, etc.):

* **Resiliência Semântica:** O roteador distingue erros fatais de cliente (`400/401/403`, que interrompem imediatamente a cadeia) de falhas transientes (`429/500/503/timeout`), disparando *retry* com *exponential backoff + jitter*, *circuit breaker* por provedor e cadeia declarativa de *fallback*.
* **Observabilidade Cega ao Conteúdo:** Métricas Prometheus, estimativa de custo por requisição, detecção de loops de agentes e teto de gasto diário funcionam sem **jamais** registrar prompts, completions, argumentos de ferramentas ou chaves nos logs.
* **Casamento Go + Clojure (EDN & Malli):** Em setembro, migrei a configuração canônica do roteador para **EDN**, validada por schemas **Malli** via Babashka, e implementei negociação de conteúdo dual-stack (`application/json` e `application/edn`) no servidor Go com um encoder zero-dependência.
* **Console Nativo Wails v2 + Svelte & SoftServe Git Bridge:** O roteador ganhou uma aplicação desktop nativa para Linux (Wails v2) exibindo sessões ativas por *fingerprinting* de conversa, além de uma ponte REST/CLI integrada ao **SoftServe Git**.

---

## 🧠 Ato III: `context-graph-engine` — Engenharia de Contexto Determinística e Medida

Entre agosto e setembro (**24 commits**), ataquei uma dor recorrente de quem trabalha pesado com agentes de código (Claude Code, Qwen Code, etc.): o desperdício de tokens e a degradação de raciocínio quando o agente precisa "adivinhar" a estrutura de um repositório grande.

Construí o **`context-graph-engine`**:
1. **Fatos e Grafo Determinístico:** O motor analisa o código-fonte (incluindo Go e Clojure, sendo capaz de indexar a si mesmo) e extrai um grafo determinístico de arquivos, namespaces e fronteiras arquiteturais, excluindo artefatos e caches externos.
2. **Task Navigator & Context Packer v2:** Dado um objetivo, o *packer* materializa um envelope de contexto com ordenação determinística, deduplicação, prefixo estável (para aproveitar *prompt caching*) e orçamento estrito de tokens.
3. **Validação Científica (`BEFORE` vs. `AFTER`):** Em vez de confiar no "feeling", construí um *benchmark reporter* que lê a telemetria real do agente comparando execuções sem envelope (*baseline*) contra execuções guiadas pelo envelope determinístico — padrão que depois implantei no `TechSentry`, `ark-streams` e `dev-machine`.

---

## 🤖 Ato IV: Rohana (Daelaam) — Do Rebranding à Rua e ao Portfólio Vivo

Em julho, consolidei o rebranding definitivo: o motor conversacional deixou o antigo nome de trabalho ("Khala") e assumiu sua identidade final como **[Rohana](https://patrickcmserrano.github.io/rohana/)** (**91 commits** no período), operada comercialmente sob a software house **Daelaam**.

* **Arquitetura Clojure Multi-Tenant:** A Rohana roda sobre **Clojure**, **Pathom 3** (resolução declarativa de contexto), **Datahike**, barramento local **Aeron IPC** e índice vetorial **Turbovec**, onde cada cliente (*tenant*) é isolado e configurado puramente via arquivos EDN.
* **Defesa Antes de Qualquer I/O:** Implementamos uma camada de *guardrail* determinística que bloqueia tentativas de *prompt injection* antes de qualquer chamada de banco ou LLM, validada por uma suíte automatizada de *red-team*, além de anonimização via **Presidio** com *allowlist* por tenant e *grounding* estrito por citação.
* **Validação no Mundo Real (Go-To-Market):** Em outubro, estruturamos o funil comercial focado na vertical odontológica em Niterói/Icaraí — mapeando 93 clínicas via Overpass, indo a campo com 19 abordagens documentadas e conquistando o primeiro *lead* quente real em operação.
* **Tenant `:patrick` 24/7:** A Rohana agora vive dentro deste próprio site (no widget de chat flutuante) e no Telegram (`@rohana_ia_bot`), respondendo sobre minha trajetória, arquitetura dos projetos e encaminhando contatos qualificados diretamente para mim em tempo real.

---

## 🛰️ Ato V: TechSentry — 19.528 Terrenos, Leilões de Veículos e iPhones na Madrugada

Outubro também marcou uma evolução intensa no **[TechSentry](https://github.com/patrickcmserrano/TechSentry)** (**57 commits**), transformando nosso coletor em Clojure em uma verdadeira plataforma de inteligência e garimpo de ativos físicos no estado do Rio de Janeiro:

* **Missão Terrenos RJ (T1 a T6):** Ao investigar a OLX para montar um dataset estadual de terrenos, descobrimos na prática que a URL de cidade era silenciosamente ignorada pela plataforma. Redesenhei o coletor para varrer o estado fatiado por faixas de preço com gravação em lote e retomada automática, validando **19.528 terrenos no RJ**. Sobre essa base, calculamos classificação urbano×rural, R$/m², medianas regionais e um **mapa interativo Camada 1** (servido com tiles do OpenStreetMap Alemão `.de` após o bloqueio do OSM padrão e a exigência de API key do CARTO).
* **Carros & Leilões (RJ / Niterói / São Gonçalo):** Criamos o pipeline de monitoramento de leilões de veículos e refinamos pesadamente o classificador de carros até R$ 30k — expurgando anúncios dos EUA infiltrados, moedas estrangeiras, *rebuilt titles*, sucatas e carros batidos/desmontados.
* **Ciclo de Smartphones (iPhones):** Adicionamos um worker dedicado rodando via timer do `systemd` às 04:00 da madrugada, capaz de identificar modelos de iPhone mesmo quando o vendedor omite a palavra "iPhone" do título ou cadastra o aparelho erroneamente na categoria de MacBook Pro.
* **Operação Versionada:** Unificamos toda a execução sob a CLI `./bin/techsentry` com builds versionados (`v2026.10.21`), motor de auditoria e bancos isolados por vertical (`data/cars/db`, `data/terrenos/db`).

---

## 📈 Ato VI: Família Ark & O Novo Portfólio sob a Luz de Sagittarius A*

Na linha quantitativa (**Nexus Quant**), fechamos a **Sprint Jul/2026-D** cumprindo à risca a disciplina científica estabelecida no post anterior:
1. **Desligamento da AlligatorTrend (D01):** As instâncias *paper* foram formalmente desligadas após o veredito de corrosão por *fees*.
2. **Modularização da Família Ark:** Extraímos os pacotes `ark-protocol`, `bitget-go` e `ark-indicators` com *golden fixtures* compartilhadas, renomeamos o `nexus-desktop` para **`ark-terminal`** (`v1.2.1`) e adicionamos coletores de microestrutura (BBO na OKX e bid/ask/spot na Bitget).
3. **Novos Vereditos de Pesquisa (D03 e D04):** O estudo de *Momentum Cross-Seccional Semanal* recebeu veredito formal de **FAIL** (arquivado), enquanto a estratégia de *Carry Condicional de Funding* passou na validação *walk-forward + holdout* (**PASS marginal**). Em outubro, o **`ark-engine`** (nosso ledger bitemporal em Clojure/XTDB) recebeu *batch writes* sem ordenação em memória e uma ponte de eventos para Redis Streams.

Por fim, dei a este portfólio (**`patrickcmserrano.github.io`**) uma identidade visual e técnica à altura do que venho construindo:
* **Sagittarius A\* em WebGL:** O plano de fundo e o portal da Home agora renderizam uma simulação física de *ray-marching* relativístico do buraco negro supermassivo no centro da nossa galáxia, combinada com o panorama galáctico real da NASA e marcação da posição da Terra quando expandido em tela cheia.
* **Memória e Densidade:** Reorganizei a página [/trabalho](/trabalho/) agrupando os sistemas por empresa (**Ping Hai**, **Daelaam**, **Nexus Quant** e os 7 anos de **Moleque de Ideias**, resgatando projetos históricos de 2018 a 2025 em Clojure, Datomic, Polylith e Onyx) e adicionei na Home o gráfico auditável de densidade de commits nas três forjas (GitHub, Neotek e AWS CodeCommit).

---

## 🗺️ O Que Vem a Seguir: A Nova Série de Deep-Dives no Blog

Este Diário de Dev #14 é a visão do helicóptero. Como cada uma dessas frentes envolveu decisões arquiteturais densas, armadilhas reais de produção e código que vale ser compartilhado em detalhes, **os próximos posts do blog serão artigos profundos (*deep-dives*) dedicados a cada tema**:

1. **[Artigo #1 — *Privacidade Não é Política, é Arquitetura: Construindo uma Plataforma Privada de IA sobre FreeBSD Jails, vLLM e Slurm*](/blog/2026-10-22-ai-factory-privacidade-por-arquitetura/)**
   Como desenhamos isolamento em nível de sistema operacional, sanitização de PII pré-vetor com quarentena criptografada e orquestração de GPUs locais sem depender de nuvens públicas.
2. **Artigo #2 — *`small-router`: Por Que Construí um Gateway de Inferência em Go com Contratos em EDN/Malli***
   Bastidores do plano de execução para agentes de código: resiliência (retry, backoff, circuit breaker), observabilidade 100% cega ao conteúdo e a ponte entre Go e o ecossistema Clojure/Babashka.
3. **Artigo #3 — *Engenharia de Contexto Determinística: Medindo o Impacto do `context-graph-engine` em Agentes de Código***
   Como transformar um repositório em um grafo navegável com orçamento estrito de tokens e o que os benchmarks A/B (`BEFORE` vs. `AFTER`) revelaram sobre o comportamento real dos LLMs.
4. **Artigo #4 — *Sagittarius A\* no Browser e um Agente Clojure Vivo no Portfólio***
   A matemática e os shaders GLSL por trás do *ray-marching* relativístico integrado ao mapa da NASA, e como embutimos a **Rohana** (Clojure + Pathom 3 + Turbovec) para atender visitantes em tempo real.
5. **Artigo #5 — *Scraping de Sobrevivência com Clojure: Garimpando 19.500 Terrenos, Leilões e iPhones no `TechSentry`***
   Como contornamos filtros silenciosos da OLX, limpamos ruído de dados do mundo real (de carros batidos a anúncios internacionais infiltrados) e automatizamos tudo na madrugada com `systemd`.
6. **Artigo #6 — *Diário Quant #15: Modularizando a Família Ark, Carry de Funding e Bitemporalidade no `ark-engine`***
   Os detalhes estatísticos do *Carry Condicional de Funding*, a extração dos protocolos Go com *golden fixtures* e a evolução do nosso ledger bitemporal em XTDB.

---

*Enquanto os próximos artigos saem do forno, você já pode explorar os diagramas interativos em [/trabalho](/trabalho/), abrir a visualização expandida de **Sagittarius A\*** no topo da página ou conversar diretamente com a **Rohana** no chat aqui no canto inferior direito.*

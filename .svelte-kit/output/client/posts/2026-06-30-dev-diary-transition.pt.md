# Diário de Dev #12.5 — Do Rebranding Arquitetural ao Ingestor de Imóveis e Telemetria Realtime

*Período: 13 de Junho a 30 de Junho de 2026*

Este diário de desenvolvimento cobre um período de transição intenso e extremamente produtivo. Entre o meio e o fim de junho, dividi meus esforços entre quatro grandes pilares: o rebranding estrutural do meu site pessoal (migrado para SvelteKit), a criação do pipeline de aluguel de imóveis no [techsentry](https://github.com/patrickcmserrano/techsentry) (Clojure), a integração de telemetria nativa com NATS JetStream no [ark-streams](file:/blob/master///home/patricks/dev/ark-streams) (Go) e o design de splash screens tridimensionais em WebGL para desktops Linux.

Aqui está a retrospectiva técnica de como reestruturei meus projetos durante estas semanas.

---

## 🌎 Re-arquitetando o Portfólio (patrickcmserrano.github.io)

Iniciei o ciclo re-arquitetando completamente meu site pessoal [patrickcmserrano.github.io](https://github.com/patrickcmserrano/patrickcmserrano.github.io) de uma SPA simples para **SvelteKit SSG** (Static Site Generation), rodando build de pré-renderização otimizado para deploy imediato no GitHub Pages.

Aproveitei esta migração para consolidar a curadoria dos meus projetos e fazer um rebranding necessário:
* **Rebranding Técnico:** O projeto anteriormente conhecido como "Khala" foi oficialmente renomeado para **Daelaam** (marca de trading quantitativo) e **Rohana** (a engine analítica subjacente desenvolvida em Clojure). Removi referências a repositórios obsoletos e inseri o **Nexus Terminal** como produto standalone.
* **Sincronização de Currículo:** Atualizei as versões em português e inglês do meu CV em LaTeX ([Patrick_Serrano_CV_2026.tex](https:/blob/master//github.com/patrickcmserrano/resume/blob/master/_base/Patrick_Serrano_CV_2026.tex)) para espelhar rigorosamente as datas e conquistas do Git no ecossistema Nexus Quant.

---

## 🛜 Telemetria Realtime, Agressão e o VIP Telegram Bot (ark-streams)

No [ark-streams](https://github.com/patrickcmserrano/ark-streams), o robô de processamento de fluxo em Go, avançamos significativamente nas frentes de controle de dados e interfaces externas:

### 1. Telemetria e NATS WebSocket Proxy
* Integramos o `nats-exporter` e o Grafana Alloy para capturar métricas do JetStream, eliminando a dependência do Grafana Cloud ao criar um dashboard interno e enxuto de telemetria no frontend.
* Implementamos suporte a compressão S2 no NATS JetStream para otimizar a largura de banda e armazenamento em disco.
* Para resolver a limitação de clientes Windows que rodam a interface desktop localmente e não conseguem se conectar diretamente ao NATS local da VPS, criamos um WebSocket proxy de NATS operando via Named Tunnels seguros (systemd).

### 2. Histórico de Agressão
* Desenvolvemos a ferramenta CLI [aggression_history.py](https:/blob/master//github.com/Nexus-Quantitative/ark-streams/blob/master/scripts/aggression_history.py) para extrair dados históricos com amostragem customizada por timeframe.
* Integramos essa lógica ao backend Go em [server.go](https://github.com/Nexus-Quantitative/ark-streams/blob/master/internal/api/server.go) e criamos o modal `AggressionHistoryModal.svelte` no app desktop para exibir a velocidade de agressão histórica Snap-to-Price.

### 3. VIP Telegram Bot (`vip_bot.py`)
Implementamos de ponta a ponta o script do [vip_bot.py](https://github.com/Nexus-Quantitative/ark-streams/blob/master/scripts/vip_bot.py) para distribuir alertas em tempo real a canais VIP:
* Monitoramento de regime de mercado multi-timeframe (alinhamento Bullish/Bearish).
* Disparo automático de níveis de suporte e resistência rompidos.
* Alertas de anomalias de fluxo e picos de liquidações cruzadas de contratos futuros de criptoativos.

---

## 🏡 Ingestor de Imóveis e Agendamento por Defasagem (TechSentry)

No [techsentry](https://github.com/patrickcmserrano/techsentry), o assistente analítico Clojure, desenvolvemos a vertical de inteligência de mercado imobiliário:

* **Pipeline de Aluguel (OLX):** Escrevemos regras de normalização de dados em Clojure para raspar listings de apartamentos e casas da OLX. Os dados são processados por geolocalização (`regioes.edn`) e ranqueados por um score de atratividade que gera resumos formatados por IA (`imoveis.md`).
* **Scheduler por Defasagem:** Em vez de usarmos timers cíclicos rígidos que geram gargalos de rede, refatoramos o [scheduler.clj](https:/blob/master//github.com/patrickcmserrano/techsentry/blob/master/src/tech_sentry/scheduler.clj) para consultar o banco de dados e rodar primeiro a vertical OLX que se encontra com o timestamp mais atrasado (seleção por defasagem).
* **Ingestão Upwork:** Iniciamos o scaffold do scanner de vagas no Upwork via leitura assíncrona IMAP de alertas de email (`upwork.clj`).

---

## 🌌 Shaders e KDE Splashes (blackhole)

Por fim, no repositório [blackhole](file:///home/patricks/dev/blackhole), trabalhei em integração gráfica para desktops Linux:
* Criamos splash screens dinâmicas para KDE ("Blackhole", "Saturn", "Nebula").
* Integramos animações interativas em WebGL (injetadas via arquivo único HTML embutido) rodando de forma fluida dentro das janelas QML usando a view `WebEngineView` do Qt.
* Ajustamos animações de câmera glissando de forma reativa aos estágios de inicialização do sistema operacional.

---

## 🤝 O Papel do Claude Opus 4.8 e Sonnet 4.6

Este ciclo de desenvolvimento dependeu bastante dos modelos da Anthropic para a transição arquitetural e DevOps:
* O **Claude Opus 4.8** atuou principalmente em Clojure e na integração do frontend Svelte do portfólio. Ele ajudou a depurar as regras de defasagem do scheduler no TechSentry e resolveu problemas de renderização nos gráficos de agressão no Wails.
* O **Claude Sonnet 4.6** auxiliou na documentação de túneis de conectividade e na configuração rápida de workflows no GitHub Actions (como o isolamento de testes de Playwright em Node 24).

---

*Esta transição assentou a fundação sólida de segurança e testes que abriu caminho para a fase subsequente de pesquisa quantitativa rigorosa na plataforma. Acompanhe os próximos posts para ver os vereditos estratégicos!*

# Diário de Dev #13 — Segurança, Testes e Vereditos Quant com Claude Fable 5 no ark-streams

*Período: 30 de Junho a 07 de Julho de 2026*

Nesta última semana, praticamente todo o meu foco de desenvolvimento esteve concentrado no [ark-streams](https://github.com/patrickcmserrano/ark-streams), a plataforma de trading intelligence em tempo real do Nexus Quantitative written em Go. O esforço foi enorme: registramos **100 commits originais** (excluindo merges), tocando **157 arquivos** e resultando em **+18.852 /blob/master/ -4.185 linhas modificadas**.

O trabalho seguiu quatro fases bem definidas: **hardening e segurança da API**, **cobertura de testes e refatoração estrutural**, **infraestrutura de observabilidade**, e finalmente, **pesquisa quantitativa baseada em dados e estratégias**. 

Além de consolidar a estabilidade do sistema, esta semana representou um salto qualitativo no uso de modelos de inteligência artificial da Anthropic, dividindo tarefas complexas entre modelos de acordo com suas aptidões cognitivas e destacando o novo **Claude Fable 5** como parceiro para pesquisa quantitativa e matemática de trading.

Aqui está o relato técnico e o veredito de como o projeto ficou ao final desta interação.

---

## 🗃️ A Divisão de Trabalho: Especialização de IA na Prática

Mapeando o rodapé `Co-Authored-By` do nosso histórico Git de 100 commits da semana, a especialização dos modelos da Anthropic ficou nítida:

1. **Claude Sonnet 5 (57% dos commits):** O motor de engenharia. Escreveu lógica pesada Go, middlewares HTTP/WebSocket e suítes de teste de integração estruturada.
2. **Claude Fable 5 (21% dos commits):** O pesquisador quant. Focado em scripts de análise em Python, simulações estatísticas (walk-forward), shadow-testing e documentação estratégica/sprints.
3. **Claude Opus 4.8 (13% dos commits):** O integrador de sistemas e DevOps. Tratou de compilações multiplataforma (Wails), chaves de deploy (GitHub Actions/SSH Bastion) e condições de concorrência e UI (Svelte).
4. **Claude Sonnet 4.6 e Haiku 4.5 (5% dos commits):** Suporte tático a proxies de rede legados e ajustes pontuais de concorrência na sincronização do app desktop.

Essa estrutura permitiu escalar o desenvolvimento mantendo uma velocidade alta e, mais importante, com qualidade e segurança de código robustas.

---

## 🔒 Ato I: Fechando as Portas (Segurança & Hardening de API)

Antes de rodar novos dados em produção, precisamos blindar o backend Go do [ark-streams](https://github.com/patrickcmserrano/ark-streams). Trabalhando de perto com o **Claude Sonnet 5** e o **Claude Opus 4.8**, executamos uma varredura crítica:

* **Timing Attacks:** Substituímos comparações simples de string na autenticação por comparações em tempo constante (`subtle.ConstantTimeCompare`) no validador do Bearer Token em [server.go](https:/blob/master//github.com/Nexus-Quantitative/ark-streams/blob/master/internal/api/server.go).
* **CORS & WebSocket Origin Check:** Removemos o wildcard CORS (`*`) em produção e passamos a validar de forma estrita o cabeçalho `Origin` em todas as conexões WebSocket.
* **WebSocket Connection Rate Limiting:** Implementamos um middleware em [middleware.go](https://github.com/Nexus-Quantitative/ark-streams/blob/master/internal/api/middleware.go) que limita novas conexões WebSocket por endereço IP (B43), mitigando riscos de ataques DDoS por saturação de sockets.
* **Permissões NATS JetStream:** No arquivo de configuração [nats.conf](https://github.com/Nexus-Quantitative/ark-streams/blob/master/deploy/nats.conf), isolamos os usuários de visualização (`viewer`), limitando suas permissões de subscribe exclusivamente ao subject `/ws/nats` (B22).

---

## 🧪 Ato II: Disciplina Estrutural & Cobertura de Testes

Com a segurança em ordem, iniciamos o pagamento sistemático de dívidas técnicas. Passamos por um refactor profundo no backend:

* **wsConnGuard:** Abstraímos a detecção de desconexão ativa de WebSocket para um guardião reutilizável ([ws_conn_test.go](https://github.com/Nexus-Quantitative/ark-streams/blob/master/internal/api/ws_conn_test.go)), eliminando código duplicado em 9 handlers WebSocket distintos de [server.go](https://github.com/Nexus-Quantitative/ark-streams/blob/master/internal/api/server.go).
* **Workers Declarativos:** Em [main.go](https://github.com/Nexus-Quantitative/ark-streams/blob/master/cmd/ark/main.go), substituímos a inicialização rígida e fan-out codificada por uma configuração declarativa de workers que garante unicidade e reinicializações limpas.
* **Refactoring do Indicators:** Unificamos os pacotes de indicadores duplicados sob a pasta `pkg/indicators`, garantindo que tanto o simulador quanto o backtester usem os mesmos blocos lógicos.
* **Expansão de Testes:** Escrevemos suítes inteiras de testes (subindo de 0% de cobertura para testado) no motor de backtest, na ingestão do coletor, na execução do broker Bitget e nos caminhos de controle do [RiskGuard](https://github.com/Nexus-Quantitative/ark-streams/blob/master/internal/executor/riskguard.go).

---

## 📈 Ato III: Infraestrutura & Observabilidade em Produção

O terceiro dia de desenvolvimento focou no deploy escalável e no monitoramento em tempo real do robô de execução quant. 

* **Autenticação via NKey:** Substituímos chaves de texto plano NATS por autenticação de pares de chaves criptográficas nkey, mantendo compatibilidade dupla temporária em [nkey_dual_auth.go](https://github.com/Nexus-Quantitative/ark-streams/blob/master/internal/streams/nkey_dual_auth.go) (B23) para evitar downtime no ecossistema.
* **Prometheus Metrics:** Integramos o cliente Prometheus para expor métricas do robô na VPS. Agora, monitoramos ativamente o estado do kill-switch, tentativas de escrita do CAS e o estado de saúde do diário do executor.
* **Divisão do Collector:** Separamos o motor de coleta em um serviço isolado (`ark-collector`), executando de forma desacoplada do motor de estratégia e mitigando panes em cascata na VPS.

---

## 🧠 Ato IV: Da Engenharia para a Pesquisa com Claude Fable 5

Foi na pesquisa quantitativa que o **Claude Fable 5** justificou sua participação de destaque na semana. Com o motor do `ark-streams` estabilizado e instrumentado, migramos nossa atenção para responder perguntas críticas de trading e modelagem estatística.

Em quant, **descobrir e arquivar uma estratégia ineficiente é tão valioso quanto encontrar uma lucrativa**, pois economiza capital real antes do deploy. O Fable 5 nos ajudou a conduzir esse processo com extremo rigor metodológico:

### 1. O Veredito de Morte da AlligatorTrend 5m
Construímos um harness de shadow-testing offline ([shadow_test_alligator.py](https://github.com/Nexus-Quantitative/ark-streams/blob/master/scripts/shadow_test_alligator.py)) e calibramos uma simulação walk-forward de múltiplos regimes de mercado ([alligator_regime_walkforward.py](https://github.com/Nexus-Quantitative/ark-streams/blob/master/scripts/alligator_regime_walkforward.py)). 
* Descobrimos que a AlligatorTrend rodando no timeframe de 5 minutos sofria severamente com custos de derrapagem (fees de corretagem Bitget Taker de 0.06%/perna) e gaps de reversão rápida de tendência.
* **O Veredito:** Fable 5 determinou formalmente a **retirada e arquivamento definitivo da AlligatorTrend 5m** em produção.
* **Reconciliação:** O modelo também isolou uma discrepância matemática que indicava retornos inflados de backtest (+39.27%) contra retornos executáveis reais (+20.18%), corrigindo um viés metodológico de lookahead em rollovers de candles.

### 2. O Veredito de Falha da TSMOM BTC
Rodamos uma modelagem walk-forward diária sobre Time-Series Momentum (TSOM) no BTC em [tsmom_walkforward.py](https://github.com/Nexus-Quantitative/ark-streams/blob/master/scripts/tsmom_walkforward.py).
* **O Veredito:** O bootstrap estatístico sobre 5.000 reamostras indicou que a estratégia não possuía vantagem (edge) estatística significativa no horizonte de dias, resultando em um veredito formal de **FAIL (Arquivada)**.

### 3. A Disciplina do Pré-Registro: Crowding (ΔOI + Funding)
Para evitar o ajuste retroativo de parâmetros (overfitting e cherry-picking), decidimos aplicar uma disciplina rigorosa adotada na academia: o **pré-registro de hipóteses**.
* Desenhamos e pré-registramos a tese de crowding contrarian em [CROWDING_CONTRARIAN_PREREG.md](https://github.com/Nexus-Quantitative/ark-streams/blob/master/docs/strategies/CROWDING_CONTRARIAN_PREREG.md).
* A tese estipula que gatilhos de ΔOI de 7d acima do percentil p90 combinados com taxas de funding extremas representam exaustão de movimento, disparando ordens contrarian de reversão à média com stop de 1×ATR.
* **A Regra Operacional de Ferro:** É terminantemente proibido rodar qualquer script exploratório de validação sobre o banco de dados `FUNDING_OI_ARCHIVE` antes dele acumular 6 meses contínuos de histórico (estimado para **janeiro de 2027**). Isso garante que o teste futuro seja puramente *out-of-sample*, sem contaminação do pesquisador espiando os dados.

---

## 🏁 Estado Atual do Projeto

Ao fim desta interação semanal intensa, o [ark-streams](https://github.com/patrickcmserrano/ark-streams) se encontra em seu estado técnico mais maduro desde a criação:

1. **Código Blindado:** A API não expõe vulnerabilidades CORS nem timing attacks, as conexões de WebSockets por IP estão sob limites rígidos de rate-limiting e o acesso de dados históricos via NATS é estritamente restrito e auditável.
2. **Arquitetura Desacoplada e Declarativa:** O loop de decisão de estratégias quantitativas está isolado de operações de I/blob/master/O, os workers do motor de execução são iniciados de maneira autônoma com tratamento seguro de restarts e o collector roda em um contêiner Docker próprio.
3. **Qualidade Assegurada:** A base de Go passou a ter alta cobertura de testes funcionais, protegendo o sistema contra quebras silenciosas no cálculo de indicadores ou envio de ordens.
4. **Metodologia de Validação Estabelecida:** Criamos um ambiente que pune severamente o overfit por meio de pré-registros claros, calibração robusta e análise de custos de fricção reais.

A separação lógica de responsabilidades na engenharia aliada à cognição especializada dos modelos Anthropic estruturou o sistema do Nexus Quantitative de forma resiliente, limpa e pronta para novos ativos e estratégias de trading.

---

*Para acompanhar mais diários de desenvolvimento e análises de engenharia, fique ligado no meu [blog](/blog).*

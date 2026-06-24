# Metodologia de Design e Tecnologias de Sobrevivência para Produtos de Software Resilientes

No desenvolvimento de produtos digitais, a velocidade de lançamento (*time-to-market*) frequentemente colide com a estabilidade operacional. Em mercados de alta frequência ou sistemas críticos de pagamento, essa colisão pode ser fatal.

Este artigo descreve as metodologias de design de arquitetura e padrões técnicos de **"Survival Architecture"** (Arquitetura de Sobrevivência) que adoto para resolver problemas reais de robustez e auditabilidade, aplicados em sistemas como o **TechSentry** e a suíte **Nexus Quant** (Ark Engine, Ark Streams, Nexus Terminal).

---

## 1. O Paradigma "Pure Core / Impure Shell" (Núcleo Puro, Casca Impura)

Muitas aplicações sofrem de acoplamento extremo porque misturam regras de negócio com chamadas de rede, escrita em banco e leitura de arquivos.

### O Problema:
Testar um fluxo de faturamento ou uma estratégia de trading torna-se impossível sem mockar conexões TCP, bancos de dados ou APIs de terceiros. Isso torna os testes lentos, frágeis e falhos.

### A Solução:
Segregar o sistema em duas partes rígidas:
*   **Pure Core (Núcleo Puro):** Composto por funções matemáticas puras. Dada a mesma entrada, sempre retornam a mesma saída, sem efeitos colaterais. É onde residem as regras de negócio complexas (cálculo de taxas, limites de risco, cruzamento de médias móveis).
*   **Impure Shell (Casca Impura):** A camada externa que lida com o mundo físico (leitura de WebSockets, requisições HTTP, escrita em disco). Ela coleta dados impuros, entrega-os ao Core puro, recebe a decisão e executa o efeito colateral.

No **TechSentry** (monitor de preços em Clojure), a inteligência de scoring de relevância e correspondência de itens é um núcleo puro e imutável. Os scrapers dinâmicos (casca impura) alimentam esse motor sem que o motor dependa deles para existir.

---

## 2. Polylith: Modularidade Pragmática sem Microserviços

A febre dos microserviços levou muitas empresas a criarem redes complexas de comunicação de rede (gargalos de rede, problemas de serialização e deploys coordenados difíceis).

### O Problema:
Desenvolvedores querem os benefícios do isolamento de código (modularidade) dos microserviços, mas sem a dor de cabeça operacional de gerenciar dezenas de servidores distribuídos.

### A Solução:
A arquitetura **Polylith** separa o código em:
1.  **Components (Componentes):** Blocos modulares isolados com interfaces públicas explícitas.
2.  **Bases (Bases):** Pontos de entrada públicos da aplicação (APIs REST, CLIs, Workers).
3.  **Projects (Projetos):** Configurações que juntam componentes e bases específicos em um único artefato executável (Monolito).

Tanto o **Ark Engine** quanto o **TechSentry** utilizam Polylith. Isso permite que todo o codebase viva em um único monorepo com isolamento estrito de dependências. Podemos rodar tudo como um monolito leve em desenvolvimento local, e se necessário no futuro, separar componentes em processos ou lambdas sem reescrever uma única linha de lógica de negócio.

---

## 3. Bitemporalidade com XTDB: Eliminando o Lookahead Bias

Em sistemas financeiros e auditorias de conformidade, saber **quando** um evento aconteceu no mundo real versus **quando** o seu sistema processou essa informação é crítico.

### O Problema:
Em simulações retroativas (backtests) de trading, é comum cair no viés de antecipação (*Lookahead Bias*) — quando o motor de backtest utiliza uma informação que, teoricamente, o sistema só aprenderia minutos ou horas depois. Bancos de dados SQL comuns sobrescrevem o estado ou usam timestamps únicos que impossibilitam a reconstrução fiel do passado.

### A Solução:
Bancos de dados bitemporais como o **XTDB** gerenciam duas linhas do tempo independentes:
*   **Valid Time (Tempo Válido):** O momento em que o evento ocorreu no mercado real.
*   **Transaction Time (Tempo de Transação):** O momento exato em que o ledger registrou o evento.

Com a arquitetura bitemporal do **Ark Engine**, as queries de backtest buscam dados usando `db.asOf(transactionTime, validTime)`. Isso garante que as simulações rodem exatamente sobre o estado de conhecimento que o sistema possuía naquele milissegundo histórico, gerando simulações 100% livres de viés e auditorias forenses completas.

---

## 4. Constitution-as-Code: O Risk Guard Determinístico

Quando lidamos com execução automática de ordens financeiras ou transações milionárias de pagamento, um bug de software pode levar à ruína financeira da empresa em segundos.

### O Problema:
Confiar que o próprio algoritmo de trading ou o microsserviço de checkout irá verificar os limites de risco é perigoso (violação do Princípio de Responsabilidade Única). Se a estratégia entrar em loop infinito por causa de um bug de concorrência, ela ignorará seus próprios limites de perigo.

### A Solução:
O padrão de **Risk Guard** (Cofre de Risco), implementado na Nexus Quant, isola a verificação de perigo em um componente impermeável apelidado de *"A Constituição"*.
*   O motor de estratégia propõe uma ordem.
*   A ordem é enviada ao **Risk Guard**.
*   O Risk Guard executa validações matemáticas duras de segurança (ex: limites de alavancagem, perda máxima diária, drawdown acumulado).
*   Se aprovada, o Risk Guard emite um token assinado de execução; se violada, a ordem é rejeitada e o circuito do sistema é desligado (*Kill-Switch*).

Este cinto de segurança é testado exaustivamente usando **Testes Gerativos** (geração automatizada de milhares de cenários caóticos aleatórios com `clojure.test.check`), garantindo matematicamente que nenhuma falha visual ou lógica da estratégia cause a liquidação da conta.

---

## 5. Parse, Don't Validate (Coerção nas Fronteiras)

Erros comuns em produção ocorrem quando dados malformados ou inesperados penetram as camadas internas do sistema, gerando exceções misteriosas (`NullPointerException` ou erros de cast de tipos).

### O Problema:
Camadas internas do sistema tentam validar dados em tempo de execução usando múltiplos condicionais `if (data != null)`, poluindo o código e mascarando inconsistências que deveriam ter sido rejeitadas na entrada.

### A Solução:
Adotar a filosofia *"Parse, Don't Validate"* (Traduza, Não Apenas Valide) na borda do sistema:
1.  Os dados brutos (JSON das exchanges, dados do scraper) chegam por canais rápidos (WebSockets/APIs).
2.  Nas fronteiras do sistema, esquemas rígidos (como **Malli** em Clojure) validam e forçam a coerção instantânea para tipos internos de domínio (ex: convertendo strings flutuantes para `BigDecimal` ou strings de data para instâncias de data/hora reais).
3.  Dados válidos continuam fluindo; dados inválidos são imediatamente descartados e encaminhados para uma **Dead Letter Queue (DLQ)** para auditoria de erros.

Dessa forma, o núcleo puro da aplicação opera sob a garantia matemática de que os dados internos sempre cumprem 100% dos contratos definidos.

---

## Conclusão

Projetar software resiliente exige assumir que **tudo o que pode falhar, vai falhar**. 

Ao desacoplar I/O através de buffers de eventos (Redis Streams / NATS JetStream), isolar a lógica de negócios em um núcleo funcional puro, blindar as fronteiras com coerção estrita e aplicar salvaguardas imutáveis de risco, conseguimos construir sistemas que sobrevivem ao caos e permanecem operacionalmente saudáveis em produção.

# Dois sistemas, duas linguagens, um contrato

**Como fundi um pipeline de trading sem reescrever nada — e por que reescrever teria sido um erro**

*Junho de 2026*

---

Eu tenho dois projetos de trading. Eles fazem coisas parecidas o suficiente para um dev ficar tentado a unificá-los, e diferentes o suficiente para que unificá-los fosse um erro.

Um é **Go**. Ele coleta WebSocket de corretora ao vivo, roda análise em tempo real e executa ordens. Está em produção, num VPS, há meses.

O outro é **Clojure**. Ele guarda dados de mercado num banco bitemporal, valida tudo com schemas estritos e trata risco como uma constituição imutável. Roda localmente.

Durante um tempo eu tratei isso como dívida técnica. "Dois projetos que se sobrepõem" soa como algo a resolver. A tentação era óbvia: escolher uma linguagem e portar o resto.

Eu não fiz isso. Este post é sobre por que — e sobre o que eu fiz em vez disso.

---

## O problema: dois projetos, uma sobreposição confusa

Colocados lado a lado, a sobreposição parecia grande:

| | Go | Clojure |
| :--- | :--- | :--- |
| Coleta de mercado | ✅ WebSocket ao vivo | parcial |
| Indicadores | ✅ motores próprios | básicos |
| Estratégias | ✅ uma, hardcoded | framework extensível |
| Execução de ordens | ✅ com kill switch | ❌ |
| Armazenamento | JetStream, 7 dias | XTDB bitemporal, permanente |
| Backtest | limitado | event-driven |
| Auditoria | journal append-only | bitemporal |

Lido assim, parece que eu mantenho duas implementações da mesma coisa. E a conclusão "natural" seria escolher o melhor de cada linha, escrever em uma linguagem, jogar o outro fora.

Só que cada linha dessa tabela esconde uma decisão sobre *onde* aquela capacidade vive bem. E é aí que a fusão por linguagem única se desfaz.

---

## Por que não unificar em uma linguagem só

### 1. O lado Go tem 21 mil linhas em produção

Medi antes de decidir: **111 arquivos Go, 21.433 linhas**. Vinte e quatro coletores de exchange. Nove arquivos de execução com broker real. Um motor de backtest. Uma API com WebSocket. Um app desktop.

Portar isso custaria meses, reintroduziria bugs já resolvidos e — o ponto que decide — **não ganharia nada de semântico**. O barramento de mensagens não se importa com a linguagem de quem publica. O contrato é o *assunto* da mensagem, não o código que a produziu.

### 2. O caminho crítico tem requisitos que a linguagem importa

O lado que coleta e executa tem um perfil específico: muitas conexões WebSocket concorrentes, latência previsível, binário pequeno para deploy, GC que não surpreende. Go existe exatamente para isso. Trocá-lo por uma JVM no caminho crítico de ordem seria pagar latência por elegância.

### 3. O lado de decisão tem requisitos opostos

O lado que guarda e audita quer: imutabilidade, dados como cidadãos de primeira classe, validação estrita na borda, e um banco que entenda tempo.

**São perfis opostos.** Um quer reação rápida e esquecimento; o outro quer memória exata e lentidão deliberada. Forçar os dois na mesma linguagem é escolher qual dos dois ficará mal servido.

---

## O princípio: fusão por fronteira, não por código

A tese do desenho cabe numa frase:

> **A fusão não mescla código — ela define fronteiras claras e usa o barramento como contrato entre os dois mundos.**

Cada sistema entra onde tem vantagem *natural*, e nenhum tenta ser o outro:

```
┌──────────────────────────────────────────────────────────────┐
│  PLANO DE DADOS — Go                                         │
│  coleta · análise em tempo real · execução                   │
│  WebSocket hardening · JetStream · goroutines · broker       │
├──────────────────────────────────────────────────────────────┤
│  O BARRAMENTO — JetStream                                    │
│  market.analyzed · signals.trade · orders · liquidation      │
│  o contrato: assuntos, não imports                           │
├──────────────────────────────────────────────────────────────┤
│  PLANO DE CONTROLE — Clojure                                 │
│  decisão · auditoria · persistência bitemporal               │
│  Risk Guard · XTDB · BigDecimal · Polylith                   │
└──────────────────────────────────────────────────────────────┘
```

E o que cada um faz, concretamente:

| Responsabilidade | Go | Clojure |
| :--- | :--- | :--- |
| Coleta WebSocket ao vivo | ✅ | ❌ não duplicar |
| Mensageria durável | ✅ | ❌ |
| Execução de ordens + kill switch | ✅ | ❌ nunca executa |
| Backfill histórico profundo | ❌ | ✅ |
| Backtest sem lookahead | ❌ | ✅ bitemporal |
| Classificador de regime macro | ❌ | ✅ |
| Qualidade de dados | ❌ | ✅ |

---

## O contrato é o barramento

O ponto de integração não é uma biblioteca compartilhada nem um serviço RPC. É o **barramento de mensagens** — que já estava lá, com retenção por assunto, entrega durável e replay.

Isso resolve um problema que apareceria em qualquer outra abordagem: **se o contrato é o barramento, os dois lados evoluem independentemente** desde que o formato da mensagem não mude. Um lado pode ser refatorado, até trocado de linguagem, e o outro nem percebe.

E não é teoria. Eu extraí os contratos para um repositório próprio — DTOs e assuntos, com módulo independente — e o outro lado passou a consumir versões em vez de importar diretório. O contrato deixou de ser "código de um projeto que o outro importa" e passou a ser **um artefato versionado com ciclo de vida próprio**.

---

## O que NÃO mudar

Esta é a seção mais importante do desenho, e é a que costuma faltar. Decidir o que os sistemas fazem é fácil; decidir o que eles *não* vão fazer é o que impede a duplicação de voltar.

* **O lado Go é o único a tocar WebSocket ao vivo.** Não duplicar coletores. Dois coletores do mesmo feed são duas fontes de verdade e duas chances de divergir.
* **O barramento central permanece único.** Não introduzir um segundo broker. Dois barramentos são dois problemas de entrega.
* **A execução continua no lado Go.** Latência e simplicidade importam no caminho crítico.
* **O lado Clojure nunca executa ordens.** Só pesquisa, persistência e regime.

Esta última linha é a decisão mais forte, e ela é uma decisão **por restrição**. Não diz o que o sistema faz — diz o que ele não faz, nunca. Um sistema definido por uma proibição é mais fácil de manter do que um definido por uma lista de capacidades, porque a proibição não cresce.

---

## Dois guards de risco que não se somam

Um achado que só apareceu quando coloquei os dois sistemas lado a lado.

Os dois projetos têm um guard de risco. Eu supus, por muito tempo, que fossem o mesmo guard em dois lugares. Não são — e protegem coisas diferentes.

| Verificação | Go | Clojure |
| :--- | :--- | :--- |
| Kill switch | ✅ | ❌ |
| Deduplicação de sinal | ✅ | ❌ |
| Idade do sinal | ✅ | ❌ |
| Drift de preço | ✅ | ❌ |
| Whitelist de símbolo | ✅ | ✅ |
| Drawdown | ❌ | ✅ |
| Alavancagem | ❌ | ✅ |
| Spread / liquidez | ❌ | ✅ |
| Tamanho de posição | ❌ | ✅ |

O guard de um protege **validade do sinal**; o do outro protege **capital**. O primeiro pergunta "este sinal é executável agora?"; o segundo pergunta "esta aposta é sobrevivível?".

**Nenhum dos dois subsume o outro.** O lado que executa pode enviar ordens que o limite de capital proibiria; o lado que guarda capital não sobrevive a um sinal reentregue.

E há uma coisa curiosa: os dois chegaram **independentemente** à mesma invariante — sinais de saída ignoram as verificações, porque uma posição precisa sempre poder ser fechada. Dois projetos, duas linguagens, mesma conclusão: a habilidade de sair é soberana.

---

## Casos de uso que a fusão habilita

O desenho não é arquitetura por arquitetura. Ele habilita coisas que nenhum dos dois faz sozinho:

**1. Backtest sem lookahead.** O banco registra cada barra com o tempo do mercado *e* o tempo em que o sistema soube dela. Um backtest pode provar que viu o que veria ao vivo — inclusive quando a corretora corrigiu o dado depois.

**2. Regime macro como gate.** O lado Clojure calcula o regime (semanal/diário) e publica no barramento. O lado Go lê e para de abrir posições contra o regime macro, sem mudar uma linha da estratégia.

**3. Qualidade de dados como alerta precoce.** O lado Clojure detecta buracos na série e publica um alerta. Você descobre a falha antes de ela virar sinal ruim.

**4. Track record auditável.** Cada ordem carrega o tempo de fechamento da barra que a originou. O banco tem o candle exato daquele momento, com o tempo de mercado. Um auditor externo pode verificar que o sinal era válido **com os dados que existiam na época** — não com os dados corrigidos de hoje.

O quarto caso justifica o projeto inteiro. Não é "guardar dados" — é guardar a diferença entre *o que aconteceu* e *o que se sabia que aconteceu*.

---

## O que eu aprendi nisso

**Poliglota não é dívida.** Eu tratei "dois projetos em duas linguagens" como problema por meses. Não era. Era uma divisão por perfil de requisito que eu ainda não tinha nomeado. Assim que dei nome — *plano de dados* e *plano de controle* — a sobreposição virou fronteira.

**O contrato precisa ser um artefato, não um import.** Enquanto um projeto importava código do outro, a fronteira era porosa. Extrair os contratos para um repositório próprio, com versão, transformou a fronteira em algo que resiste a refatoração.

**Decidir o que não fazer é o que estabiliza.** A linha "o lado Clojure nunca executa ordens" faz mais pela arquitetura do que qualquer lista de capacidades. Restrições não crescem; funcionalidades, sim.

---

## Estado atual, sem inflar

**Feito:** os contratos estão extraídos e versionados; o barramento está em produção; o lado Go coleta, analisa e executa com guard e reconciliação; o lado Clojure tem o armazenamento bitemporal e o guard de capital.

**Falta:** o lado Clojure ainda não está deployado como serviço; o consumo do barramento do lado Clojure não existe; o gate de regime não está ligado. E há uma decisão de latência em aberto — integração síncrona com deadline versus assíncrona — que depende de quanto se aceita de latência no caminho de ordem.

**E o mais desconfortável:** os dois guards têm limites que *divergem*. O documento constitucional de um lado declara faixas e um limiar de staleness; o código do guard implementa valores mais permissivos. Ligar os dois antes de reconciliar isso propaga a divergência em vez de resolvê-la.

Arquitetura documentada e arquitetura executada são coisas diferentes. Este texto é sobre a primeira. A segunda tem uma lista de pendências, e ela está escrita.

---

*A pergunta que destrava esse tipo de desenho não é "qual linguagem é melhor". É "qual é o perfil de requisito de cada lado". Se os perfis forem opostos, você tem dois sistemas — e precisa de um contrato, não de uma reescrita.*

# Da Lisp Machine à IA Incorporada: Reconstruindo o Voyager e o Mineflayer Dentro da JVM com Clojure e Java 21

*Como evoluímos a injeção cirúrgica de bytecode e REPL no Minecraft para uma arquitetura cognitiva de processo duplo (System 1 & 2), contornando 15 anos de dívida técnica em Node.js com física zero-copy, A* em 64 bits e contratos formais sem eval().*

No final de outubro, publicamos aqui o artigo [*Hackeando o Runtime do Minecraft ao Vivo: Hotpatching de JVM, ASM e Manipulação de Estado sem Reiniciar o Servidor*](file:///home/pace/dev/patrickcmserrano.github.io/static/posts/2026-10-25-hackeando-runtime-jvm-minecraft-hotpatch-asm.pt.md). Naquele texto, demonstramos como a `Java Attach API`, a manipulação de bytecode em tempo de execução com ASM e a transposição de ClassLoaders permitiram recuperar inventários de jogadores corrompidos sem desligar o servidor de produção. Concluímos aquele relato com uma provocação arquitetural: transformar o Minecraft em uma *Lisp Machine* via Clojure e nREPL acoplados ao ciclo de ticks (`ServerThread`).

Dez dias depois, essa ideia saiu do papel e foi posta à prova no mundo real. Nosso objetivo imediato era povoar nosso servidor multiplayer modded (Fabric 1.21.1) com agentes autônomos persistentes e úteis. Projetamos dois personagens centrais: **Karlach**, a cuidadora do Santuário de Fauna Silvestre em `[-171, 65, 171]`, encarregada de patrulhar cercados, conduzir animais perdidos e alimentar espécies como capivaras e cervos; e o **Capitão Picard**, operando na ponte orbital da nave Enterprise em `Y=145`.

Para dar vida física a esses NPCs, fizemos o que praticamente toda a indústria e a academia fazem há mais de uma década: subimos processos externos em Node.js utilizando o **Mineflayer**.

Em menos de uma hora de operação sob condições reais, o sistema colapsou. A Karlach começou a andar agachada involuntariamente no meio do santuário; ao tentar conduzir uma capivara para o cercado sul, o temporizador expirou e ela se trancou do lado de dentro do portão duplo; e, quando um jogador empunhou uma arma de fogo do mod *Just Enough Guns (JEG)*, o terminal do Node.js explodiu em erros de decodificação binária de pacotes de rede. Ao abrirmos o monitor de recursos da máquina (`htop`), **três bots ociosos consumiam mais de 620 MB de memória RAM**.

Ao abrirmos o código-fonte dessas ferramentas para diagnosticar as falhas, percebemos que o problema não era pontual. Estávamos diante das limitações estruturais de uma decisão arquitetural tomada em 2011 — e que hoje trava a evolução da Inteligência Artificial Incorporada (*Embodied AI*). 

Este artigo detalha como construímos o **`craft-agents`**: uma plataforma de agentes autônomos de processo duplo que substitui a camada externa em JavaScript por motores cognitivos e cinemáticos nativos na JVM, reduzindo o consumo de memória em 99,7% (< 500 KB por agente), garantindo reflexos a 20 Hz e eliminando a vulnerabilidade do `eval()` arbitrário através de validação estática por AST e contratos com Malli.

---

## 1. A Parede Invisível de 2011: Por Que o Paradigma Voyager + Mineflayer Bateu no Teto

Em maio de 2023, uma equipe de pesquisadores liderada por Jim Fan (NVIDIA), em colaboração com Caltech e Stanford, publicou o **Voyager** (*An Open-Ended Embodied Agent with Large Language Models*). O artigo representou uma quebra de paradigma na IA aplicada a jogos: em vez de depender de Aprendizado por Reforço (*Reinforcement Learning*), que requer milhões de horas de simulação com funções de recompensa rígidas e hiper-específicas, o Voyager utilizou Modelos de Linguagem (LLMs) ancorados em três mecanismos:

1. **Currículo Automático (*Automatic Curriculum*):** a LLM inspeciona o inventário e o estado do ambiente para propor objetivos incrementais de exploração em mundo aberto;
2. **Ciclo Iterativo de Tentativa e Erro (*Iterative Prompting*):** execução de ações no jogo, leitura de erros de execução e autocorreção do plano;
3. **Biblioteca Evolutiva de Habilidades (*Skill Library*):** programas bem-sucedidos são sintetizados, indexados em um banco vetorial (ChromaDB) e reutilizados de forma hierárquica para resolver tarefas mais complexas.

Os resultados foram impressionantes: o agente obteve 3,3 vezes mais itens únicos, explorou distâncias 2,3 vezes maiores que qualquer abordagem anterior e fabricou ferramentas de diamante de forma totalmente autônoma. O Voyager estabeleceu o estado da arte da *Embodied AI*.

Porém, ao tentar rodar o Voyager ou construir sistemas similares em ambientes de produção multiplayer, o desenvolvedor encontra um projeto oficial congelado desde julho de 2023, marcado por dependências quebradas e custos proibitivos de API. O motivo desse envelhecimento precoce reside na fundação de software sobre a qual o cérebro em Python se apoiava: o **Mineflayer**.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ PILHA HISTÓRICA CLÁSSICA (VOYAGER 2023 / MINEFLAYER 2011)              │
│                                                                        │
│   [ Python Process ] (Voyager / LLM / ChromaDB)                        │
│          │                                                             │
│          ▼ (JSPyBridge - Ponte IPC via stdin/stdout / WebSocket)       │
│   [ Node.js Runtime (V8) ]                                             │
│          ├── Mineflayer Core (EventEmitter God-Object com 41 plugins)  │
│          ├── mineflayer-pathfinder (A* síncrono bloqueando EventLoop)  │
│          ├── ProtoDef (Parser binário com esquemas estáticos Vanilla)  │
│          └── Cópia isolada do mundo em RAM (~210 MB / bot)             │
│          │                                                             │
│          ▼ (Conexão TCP Externa / Loopback 127.0.0.1:25565)            │
│   [ Minecraft Server (JVM Fabric) ]                                    │
│          └── Netty IO ➔ Decodificação ➔ ServerThread (20 Hz)           │
└────────────────────────────────────────────────────────────────────────┘
```

### Por que escolheram JavaScript em 2011?

O Mineflayer foi criado em 2011 por Andrew Kelley (que mais tarde criaria a linguagem Zig). Na época, a escolha do ecossistema Node.js foi pragmática e justificada:
- **O estado do Java:** O Java estava nas versões 6 e 7, com sintaxe verbosa, sem expressões lambda (introduzidas apenas no Java 8 em 2014) e com footprint de memória desfavorável para pequenos utilitários de linha de comando.
- **A ascensão do Node.js:** O modelo não-bloqueante de Ryan Dahl e o *EventEmitter* eram a tecnologia mais atraente para programar protocolos de rede orientados a eventos, impulsionados pela célebre Lei de Atwood (*"qualquer aplicação que possa ser escrita em JavaScript, eventualmente será escrita em JavaScript"*).
- **Proteção Jurídica (Clean-Room Reverse Engineering):** Analisar pacotes de rede via Wireshark e reimplementar o protocolo em JavaScript protegia o projeto contra riscos de DMCA e litígios por descompilação do `.jar` proprietário da Mojang.
- **A ambição do PrismarineJS:** Criar uma suíte completa de bibliotecas capazes de rodar um cliente de Minecraft inteiramente dentro do navegador WebGL (`prismarine-viewer`).

### O cenário em 2026: O tabuleiro virou

Quinze anos depois, essas premissas inverteram-se completamente:
1. **O Java moderno (21 a 25):** A JVM agora oferece *Virtual Threads* (Projeto Loom) para concorrência massiva de I/O, *Records* imutáveis, *Foreign Function & Memory API* (Projeto Panama) e compiladores JIT (C2 / GraalVM) que superam amplamente o V8 em computação geométrica intensiva.
2. **A revolução do modding com Fabric:** A própria Mojang disponibiliza mapas oficiais de desofuscação, e a arquitetura modular do Fabric permite injeção in-process limpa e legalizada.
3. **Inadequação do V8 para física volumétrica 3D:** O Garbage Collector e o modelo de alocação de objetos do motor V8 foram desenhados para documentos DOM e serialização JSON — não para indexar matrizes tridimensionais de voxels, calcular caixas de colisão AABB (*Axis-Aligned Bounding Box*) e resolver caminhos A* sem tipos inteiros de 64 bits empacotados.

Ao abrirmos o código-fonte do Mineflayer e de seus módulos satélites, identificamos **cinco falhas estruturais** incontornáveis:

1. **O God-Object Mutável:** O método `createBot()` instancia um `EventEmitter` e injeta 41 plugins internos por meio de *monkey-patching*. Não há isolamento de atuadores: se o pathfinder assume o controle das pernas e um listener de chat aciona um comando de agachamento concorrente, as variáveis internas colidem, deixando o NPC permanentemente agachado.
2. **Duplicação Brutal de Chunks e RAM:** Por ser um processo externo isolado, cada bot precisa descompactar e armazenar na memória do Node.js sua própria cópia dos chunks ao redor. Trinta agentes guardas em uma vila duplicam a mesma geometria tridimensional trinta vezes no heap V8, desperdiçando mais de 6 GB de RAM.
3. **Incompatibilidade Binária com Mods:** O parser binário `ProtoDef` baseia-se em tabelas JSON estáticas do jogo Vanilla. Quando mods como *Just Enough Guns* ou *Naturalist* anexam novos componentes NBT ou entidades customizadas, o parser lê parte dos bytes e aborta com erros do tipo `Chunk size is 42 but only 22 was read`, passando a enxergar entidades novas como desconhecidas (`'unknown'`).
4. **Fragilidades Ocultas no Pathfinder:** Inspecionando o arquivo `movements.js` do `mineflayer-pathfinder`:
   - O algoritmo A* roda de forma síncrona na thread única do Node.js, consumindo até 40 ms a cada tick de 50 ms e estrangulando o Event Loop.
   - Na linha 101, a propriedade `canOpenDoors` vem desativada por padrão com a anotação `// Causes issues`.
   - Na linha 389, a detecção de portas analisa apenas a altura dos pés (`bot.entity.position.y`), ignorando portões duplos empilhados (comuns em cercados de animais para impedir fugas). O algoritmo classifica o portão superior como parede sólida intransponível.
   - No arquivo `goals.js` (linha 216), `GoalBreakBlock` omite o argumento `node` na chamada a `isEnd()`, gerando `TypeError` em tempo de execução.
5. **O Pecado Original do `eval()` e o Coma Temporal:** No Voyager, a LLM gera código JavaScript cru como string, executado via `eval()` no processo do Mineflayer. Uma chamada a uma API externa de LLM consome entre 1.500 ms e 3.000 ms. Enquanto o modelo infere o próximo passo, o jogo roda a 20 ticks por segundo (50 ms por tick). O bot permanece em **coma sensorial por 30 a 60 ticks**, incapaz de reagir a um ataque de creeper ou a uma queda, enquanto queima dólares em requisições de texto livre para ações mecânicas simples.

---

## 2. Contornando o Socket TCP: Modo Server-Native Zero-Copy e Hot-Reload na JVM

A primeira decisão arquitetural do `craft-agents` foi eliminar o intermediário de rede TCP quando o agente habita o mesmo servidor físico. Por que forçar um bot local a serializar pacotes, abrir conexões de socket de loopback e disputar buffers com clientes de internet?

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ARQUITETURA DUAL-BACKEND DO CRAFT-AGENTS                               │
│                                                                        │
│ [ MODO SWARM: Servidores Externos ]                                    │
│   Virtual Threads (Java 21) ➔ SharedSwarmWorld (Cache Imutável Único)  │
│                                                                        │
│ [ MODO SERVER-NATIVE: Produção Local Modded (Fabric 1.21.1) ]          │
│                                                                        │
│   Minecraft Server Runtime (PID 3741121)                               │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ ServerPlayerEntity (Karlach / Picard)                          │   │
│   │   ├── SilentEmbeddedChannel (Netty Zero-Copy em RAM)           │   │
│   │   ├── LiveWorldVoxelAccessor (Lê VoxelShapes reais da memória) │   │
│   │   └── In-Server Bridge TCP Localhost (:25595)                  │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │ Comandos compactos                │
│                                    ▼ (MOVE|SWING|LEASH|SANCTUARY)      │
│   Engine Cognitiva Clojure 1.12 (craft-agents.service :8095)           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ System 0: Reflexos Autonômicos (50ms / Leases Físicos)         │   │
│   │ System 1: Behavior Trees em EDN + Grounding Semântico (<1ms)   │   │
│   │ System 2: Planejamento Voyager 2.0 sob Gatilhos (MCP)          │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

No **Modo Server-Native**, instanciamos a classe oficial `ServerPlayerEntity` do Fabric diretamente dentro do mundo do servidor (`ServerWorld`), acoplando-a a um canal de rede customizado: o `SilentEmbeddedChannel`.

```java
// Trecho simplificado de SilentEmbeddedChannel.java
package com.craft.agents.fabric;

import io.netty.channel.embedded.EmbeddedChannel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelOutboundHandlerAdapter;
import io.netty.channel.ChannelPromise;

public class SilentEmbeddedChannel extends EmbeddedChannel {
    public SilentEmbeddedChannel() {
        super(new ChannelOutboundHandlerAdapter() {
            @Override
            public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
                // Descarta pacotes de renderização outbound (S2C) diretamente na memória.
                // Não há serialização de pacotes pesados de chunks para a rede local.
                io.netty.util.ReferenceCountUtil.release(msg);
                promise.setSuccess();
            }
        });
    }
}
```

Essa abordagem traz três vantagens imediatas:
1. **Consumo de Memória < 500 KB por agente:** O agente lê os blocos do mundo diretamente da estrutura `ThreadSafe` de chunks do servidor através de referências de memória. Não há cópias secundárias de dados geográficos.
2. **Imunidade a Desyncs de Física:** O agente é uma entidade de primeira classe na simulação da Mojang. Gravidade, arrasto de fluidos, recuo de dano e colisões de blocos modificados por mods são calculados pela física canônica do servidor.
3. **Compatibilidade Total com Mods:** Como a entidade existe dentro do ecossistema do Fabric, ela manipula armas do *Just Enough Guns* e interage com animais do *Naturalist* sem que nenhum pacote de rede precise ser decodificado fora da JVM.

### A Arte do Hot-Reload sem Reiniciar: Lições do HotSpot

Para manter o princípio de zero downtime consolidado no artigo anterior, construímos o `BridgeReloadAgent` e o `AttachCli`. Com eles, recompilamos classes Java e as injetamos via `Instrumentation.redefineClasses()` dentro da JVM do Minecraft em execução.

Durante o desenvolvimento da navegação da Karlach, nos deparamos com dois incidentes reais de JVM que merecem registro:

> **Incidente #1: O Noclip Fantasma e o Arquivo Temporário Deletado**  
> Após uma atualização no código de movimentação, o script de build compilava o `.jar`, anexava o agente via `VirtualMachine.attach(pid)` e excluía o arquivo temporário `craft-agents-agent.jar` logo em seguida. No entanto, o agente em segundo plano ainda precisava carregar classes auxiliares sob demanda. O ClassLoader do Fabric (`KnotClassLoader`) disparou `java.nio.file.NoSuchFileException`, falhando silenciosamente a redefinição de métodos de colisão. O resultado: a Karlach começou a atravessar paredes e cercas como um fantasma (*noclip* total).  
> **Solução:** O `AttachCli` passou a sincronizar a confirmação de carga completa de todas as classes pelo canal de controle antes de realizar a limpeza de arquivos temporários.

> **Incidente #2: `attempted to add a method` na JVM HotSpot**  
> Ao introduzir suporte para identificação de entidades ofuscadas, adicionamos um método auxiliar `resolveEntityName()` diretamente na classe `SyntheticPlayerFactory.java`. Ao disparar o reload, a JVM abortou a operação:  
> `class redefinition failed: attempted to add a method (class: com/craft/agents/fabric/SyntheticPlayerFactory)`  
> A especificação da JVM (JVMTI) e a implementação padrão da HotSpot não permitem adicionar ou remover métodos ou campos de classes já carregadas durante `redefineClasses`.  
> **Solução Arquitetural:** Separamos a lógica dinâmica em classes auxiliares sem estado, como `EntityTargetResolver.java`. Quando precisamos de novas capacidades, o agente injeta a nova classe no ClassLoader via `ClassLoader.defineClass` (que é permitido para classes inéditas) e mantém intacta a assinatura pública das classes originais.

---

## 3. Cognição Tri-Temporal (System 0 / 1 / 2) e Arbitragem por Leases Físicos

Para solucionar o coma sensorial de 40 ticks e o custo insustentável de acionar LLMs para cada ação motora, adotamos a teoria de processo duplo de Daniel Kahneman, decomposta em **três velocidades temporais desacopladas**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ COGNIÇÃO TRI-TEMPORAL                                                  │
│                                                                        │
│   System 0: Reflexos Motores e Propriocepção (20 Hz / 50ms)            │
│   ├── Loop síncrono in-JVM / Clojure core                              │
│   ├── Arbitragem de Leases Físicos Concorrentes (:legs, :hands, :gaze) │
│   └── Reações autonômicas imediatas (esquiva de lava, recuo, pulo)     │
│                                                                        │
│   System 1: Roteamento Semântico e Behavior Trees (0 a 50ms)           │
│   ├── Semantic Router com n-gramas locais (< 1ms / zero API)           │
│   ├── Ancoragem espacial no Grafo de Conhecimento (grounding.clj)      │
│   └── Behavior Trees em dados puros (.edn) / 95% do tempo de vida      │
│                                                                        │
│   System 2: Cognição Estratégica via LLM (Assíncrono sob Gatilhos)     │
│   ├── Acionado sob: falha empírica, novos objetivos ou diálogo livre   │
│   ├── Comunicação via MCP (Model Context Protocol) sem eval()          │
│   └── O corpo continua vivo e protegido pelo System 0 durante a espera │
└────────────────────────────────────────────────────────────────────────┘
```

### Arbitragem Concorrente por Leases Físicos

Para extinguir o problema do *God-Object* do Mineflayer, o corpo do agente no `craft-agents` é particionado em três canais de atuadores ortogonais, gerenciados por contratos formais de posse (*leases*):

```clojure
;; Trecho de leases.clj
(ns craft.agents.leases)

(def initial-actuators
  {:legs  {:owner nil :priority 0 :since 0}
   :hands {:owner nil :priority 0 :since 0}
   :gaze  {:owner nil :priority 0 :since 0}})

(defn acquire-lease [state channel task-id priority tick]
  (let [current (get-in state [:actuators channel])]
    (if (or (nil? (:owner current))
            (> priority (:priority current)))
      (assoc-in state [:actuators channel]
                {:owner task-id :priority priority :since tick})
      state)))
```

Dessa forma, a Karlach pode caminhar em patrulha pelo santuário (`:legs` sob prioridade 20), manter o olhar voltado para o jogador que se aproxima (`:gaze` sob prioridade 40) e acenar com a mão (`:hands` sob prioridade 30). Se um zumbi desferir um golpe pelas costas, o subsistema de defesa assume imediatamente a posse de todos os canais com prioridade 100, interrompendo a rotina civil de forma limpa e sem conflitos de estado.

---

## 4. Evolução Sem eval(): Skill Library Declarativa em EDN, Malli Gatekeeper e Critic Empírico

No Voyager, o aprendizado de novas habilidades ocorria pela gravação de strings de código JavaScript cru geradas pelo modelo. Se a LLM alucinasse uma variável inexistente ou gerasse um laço `while (true)` sem condição de escape, o processo do bot travava.

No `craft-agents`, **a IA nunca gera código executável imperativo**. O modelo expressa novas habilidades exclusivamente como sub-árvores declarativas em EDN (*Extensible Data Notation*), transmitidas através de ferramentas do protocolo MCP (*Model Context Protocol*).

```clojure
;; Exemplo de habilidade sintetizada: Abrigo emergencial contra tempestades
{:skill/id :shelter-from-rain
 :skill/version 1
 :tree
 [:sequence
  [:condition {:check :weather-is-raining?}]
  [:selector
   [:condition {:check :inside-shelter?}]
   [:sequence
    [:action {:id :nav/path-find :target :sanctuary-cabin :timeout-ms 8000}]
    [:action {:id :portal/cross-and-close :portal :cabin-door :timeout-ms 3000}]
    [:action {:id :chat/say :message "Chuva forte lá fora. Me abrigando na cabana."}]]]]}
```

Antes que qualquer estrutura como essa seja aceita na biblioteca persistente do agente, ela é submetida ao **Malli Gatekeeper** ([`schemas.clj`](file:///home/pace/dev/craft-agents/src/clj/craft/agents/schemas.clj)):

```text
┌────────────────────────────────────────────────────────────────────────┐
│ OS 4 TESTES DO MALLI GATEKEEPER                                        │
│                                                                        │
│ 1. Validação Estrutural Estrita:                                       │
│    Esquema Malli garante que a AST é uma árvore válida (:sequence,     │
│    :selector, :action, :condition).                                    │
│                                                                        │
│ 2. Whitelist Formal de Ações:                                          │
│    Verifica se cada :id chamado existe no catálogo primitivo seguro.   │
│    Chamadas arbitrárias a funções de sistema ou nREPL são rejeitadas.  │
│                                                                        │
│ 3. Timeouts Obrigatórios:                                              │
│    Todo nó que envolve espera física no mundo real exige :timeout-ms.  │
│    Impede que o agente congele esperando eventos que nunca ocorrem.    │
│                                                                        │
│ 4. Análise Estática de Grafos:                                         │
│    Ordenação topológica que comprova ausência de dependências          │
│    cíclicas ou recursões infinitas na árvore.                          │
└────────────────────────────────────────────────────────────────────────┘
```

### O Critic Empírico: Fim da Alucinação de Sucesso

Um dos maiores problemas de agentes baseados em LLM é a alucinação de conclusão: o agente executa uma sequência de passos e declara *"O cervo foi resgatado e está seguro dentro do cercado"* sem ter conferido o resultado no mundo físico.

No `craft-agents`, o subsistema **Environmental Critic & Reflexion** ([`critic.clj`](file:///home/pace/dev/craft-agents/src/clj/craft/agents/cognition/critic.clj)) faz a verificação empírica. Quando a Karlach fecha o portão do cercado, ela dispara a primitiva `SANCTUARY`:

```text
Bridge ➔ SANCTUARY
Bridge  OK|{"SW":1,"NW":0,"NE":2,"SE":0,"OUT":1}|{"naturalist:deer":1}|Karlach[-168.2,65.0,172.4]
```

O Critic analisa as caixas delimitadoras tridimensionais do habitat. Se a contagem de animais dentro do quadrante sul não aumentou em relação ao estado inicial da missão, a tarefa **não é concluída**. O plano é marcado como falha empírica e aciona o módulo de reflexão para formular uma hipótese de autocorreção (ex: *"a corda arrebentou durante a curva no portão"*), limitado a no máximo duas tentativas para evitar loops de retry.

---

## 5. Engenharia Reversa do Mineflayer em Java 21 Zero-GC: PathSolver3D e Portais Transacionais

Para substituir o módulo `mineflayer-pathfinder` com ganhos reais de performance, aproveitamos o conhecimento cinemático consolidado pelo projeto original, mas reimplementamos o algoritmo A* do zero em Java 21, eliminando alocações dinâmicas de objetos no heap durante a busca.

### Empacotamento de Coordenadas em 64 Bits (`PackedPos`)

Em vez de instanciar milhares de objetos `Vec3d` ou `BlockPos` para cada nó avaliado na fila de prioridade, codificamos coordenadas tridimensionais completas em um único primitivo `long`:

```java
// Trecho de PackedPos.java
package com.craft.agents.nav;

public final class PackedPos {
    // 26 bits para X, 26 bits para Z e 12 bits para Y (-2048 a +2047)
    public static long pack(int x, int y, int z) {
        return (((long) (x & 0x3FFFFFF)) << 38) |
               (((long) (z & 0x3FFFFFF)) << 12) |
               ((long) (y & 0xFFF));
    }

    public static int unpackX(long packed) {
        int val = (int) (packed >> 38) & 0x3FFFFFF;
        return (val >= 0x2000000) ? val - 0x4000000 : val;
    }
    // ... métodos unpackY e unpackZ equivalentes
}
```

Combinamos o `PackedPos` com estruturas de dados baseadas em arrays de tipos primitivos:
- **`PrimitiveMinHeap.java`:** Fila de prioridades com arrays `long[]` para nós e `float[]` para custos `f(n) = g(n) + h(n)`;
- **`LongHashSet.java`:** Tabela hash com endereçamento aberto sobre `long[]` para conjunto de nós fechados.

O resultado é um motor de busca tridimensional que roda em *Virtual Threads* com **alocação zero de objetos durante a resolução do grafo**, executando buscas de 80 passos em relevo acidentado em menos de 3 milissegundos.

### Consulta Fiel de Geometria: `LiveWorldVoxelAccessor`

Diferente do Mineflayer, que depende de simplificações estáticas em JSON, o `PathSolver3D` interroga a geometria exata do mundo através de `LiveWorldVoxelAccessor.java`. Ao consultar `ServerWorld.getBlockCollisions()`, o algoritmo avalia os volumes de colisão (`VoxelShape`) reais da Mojang. Blocos de mods, escadas, lajes e cercas são avaliados com precisão matemática em tempo real.

### Portais Semânticos Transacionais

O bug clássico da Karlach ficar presa nos portões duplos foi solucionado pelo conceito de **Portais Semânticos Atômicos** ([`PortalDetector.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/nav/PortalDetector.java) e [`nav_portals.clj`](file:///home/pace/dev/craft-agents/src/clj/craft/agents/nav_portals.clj)):

```text
┌────────────────────────────────────────────────────────────────────────┐
│ MÁQUINA DE ESTADOS DO PORTAL TRANSACIONAL                              │
│                                                                        │
│   [ 1. APROXIMAÇÃO ] ➔ Alinha o agente na âncora externa (outside-pos) │
│          │                                                             │
│          ▼                                                             │
│   [ 2. ABERTURA ATÔMICA ] ➔ Interage com portão inferior e superior    │
│          │                                                             │
│          ▼                                                             │
│   [ 3. TRAVESSIA VETORIAL ] ➔ Monitora produto escalar (Dot Product)   │
│          │                    entre vetor de marcha e plano do portal  │
│          ▼                                                             │
│   [ 4. FECHAMENTO GARANTIDO ] ➔ Bloco finally tranca o portal          │
│                                 mesmo se houver interrupção externa    │
└────────────────────────────────────────────────────────────────────────┘
```

A travessia não utiliza temporizadores cegos (`setTimeout`). O sistema monitora a posição do centro da caixa de colisão do agente em relação ao vetor normal do portal. O fechamento do portão só ocorre após a confirmação geométrica de que o corpo do agente e o animal que o acompanha cruzaram integralmente o plano de passagem.

---

## 6. Quando a Simulação Encontra a Física Real: Três Histórias de Guerra no Santuário

A teoria de agentes autônomos costuma ser elegante nos artigos; no entanto, quando o código encontra a física de um jogo em produção, desafios inesperados surgem. Compartilhamos três incidentes reais enfrentados durante a estabilização da Karlach:

### 1. Física Multicorpo e a Elasticidade da Corda 3D

Para conduzir animais, a abordagem ingênua consistia em disparar comandos de teleporte periódicos (`/tp @e[type=deer] Karlach`). O resultado visual era artificial: o animal deslizava pelo terreno como um boneco de pano, quebrando a imersão.

Optamos pela condução física via laço (*leash*), acionando os métodos nativos do Fabric: `MobEntity.attachLeash(player, true)` (`method_60964` no Fabric 1.21.1) e emitindo o pacote de sincronização `EntityAttachS2CPacket`. Jogadores humanos agora visualizam a corda tridimensional elástica vibrando entre a mão da Karlach e o animal.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ DEADLOCK GEOMÉTRICO DO LAÇO (CORDA QUEBRANDO A 4.2 METROS)             │
│                                                                        │
│   [ Cercado Sul ]                         [ Corredor Externo ]         │
│   ┌─────────────────────────────┐                                      │
│   │                             │         Vetor de Marcha Karlach      │
│   │                             │                ▲                     │
│   │   [Portão Duplo Fechado] ───┼────────────────╫────────────►        │
│   │              │              │                │ Karlach (0.245 m/s) │
│   │              │              │ Corda esticada │                     │
│   │              │              │ (tensão > 10m) ▼                     │
│   │              │              │                                      │
│   │              │              └─► [Quina da Cerca de Espruce]        │
│   │              │                       ▲                             │
│   │              │                       │ Cervo retido atrás do mourão│
│   └──────────────┴───────────────────────┴─────────────────────────────┘
└────────────────────────────────────────────────────────────────────────┘
```

Isso expôs um problema de física multicorpo:
- Ao fazer a curva fechada para entrar no portão duplo, a Karlach mantinha sua velocidade normal de caminhada (`0.245` blocos/tick).
- O cervo ficava retido na quina exterior da cerca de espruce.
- A distância ultrapassava o raio elástico de 10 blocos e o Minecraft destruía a corda, dropando o item de laço no chão.

**A Solução de Engenharia:**
- **Aproximação Estrita Pré-Laço:** A Karlach navega até estar a ≤ 2.2 metros de distância física da entidade antes de tentar laçá-la, com alcance máximo de interação configurado em 4.5 metros.
- **Marcha Adaptativa por Tensão:** Reduzimos a velocidade de condução com guia para `0.165` blocos/tick e implementamos alívio de tensão (`0.090`) quando o laço estica.
- **Telemetria Tátil a 20 Hz (`LEASH_STATUS`):** A ponte Java inspeciona a cada tick se `mob.isLeashed()` continua verdadeiro. Se o laço romper, o System 0 dispara *Early Abort* imediato, interrompendo a rota e evitando que a Karlach continue andando sozinha até o destino.
- **Soltura no Interior antes do Trancamento:** A Karlach conduz o animal até o ponto profundo do cercado (`deep-in`), desata o laço no interior e somente então caminha de volta para trancar o portão pelo lado de fora.

### 2. Ofuscação Intermediary vs Mods: `class_4019` vs `minecraft:fox`

Ao emitir o comando de chat `<pace> karlach, recolha a raposa`, a resolução semântica falhava silenciosamente, enquanto animais de mods como o cervo do *Naturalist* funcionavam sem problemas.

Ao investigar o bytecode da JVM em execução, identificamos a causa:
- Animais do mod *Naturalist* mantêm seus nomes de classe desofuscados no classpath (`com.starfish_studios.naturalist.entity.DeerEntity`).
- Entidades nativas do Minecraft Vanilla, sob o mapeamento Intermediary do Fabric, têm suas classes ofuscadas em produção. A raposa não se chama `FoxEntity`, mas sim `net.minecraft.class_4019`.

Criamos o [`EntityTargetResolver.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/fabric/EntityTargetResolver.java), que consulta diretamente o registro oficial de tipos da Mojang (`Registries.ENTITY_TYPE.getId()` / `field_41177`), mapeando identificadores semânticos (`minecraft:fox`), tags customizadas e nomes de mods sob uma interface unificada.

### 3. Quando os Mocks Mentem: O Bug Silencioso do Mapa Vazio `{}`

Durante os testes automatizados, nossa suíte acusava 100% de aprovação. No entanto, no jogo, a Karlach sempre aguardava o tempo limite de 80 ticks ao tentar validar a contenção de animais.

Inspecionando os logs de rede da ponte `:25595`:
```text
Recebido: OK|{}|{"naturalist:deer":1}|Karlach[-168.2,65.0,172.4]
```

O mapa de contagem por quadrante vinha vazio (`{}`). Em `SyntheticPlayerFactory.java`, a lógica de agrupamento espacial calculava as caixas delimitadoras, mas esquecia de invocar `counts.put(quadrantKey, count)`. Como nossos testes unitários usavam strings mockadas contendo `{"SW":1}`, eles passavam com perfeição enquanto o servidor real falhava. Corrigir o preenchimento real desse mapa reduziu o tempo de confirmação do Critic de 4 segundos para **exatamente 1 tick (50 ms)**.

---

## 7. Observabilidade Viva: O Agent Studio (:8095) e o Desenvolvimento Orientado a Provas

Depurar sistemas cognitivos complexos exige observabilidade transparente. No Mineflayer, o diagnóstico costuma resumir-se a acompanhar saídas de texto no console.

Para o `craft-agents`, construímos o **Agent Studio**, um dashboard de monitoramento servido em `http://localhost:8095` via Ring, SSE (*Server-Sent Events*) e WebSockets:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ PAINEL DO AGENT STUDIO (:8095)                                         │
│                                                                        │
│ [ Karlach - Caretaker ]              [ Capitão Picard - Orbital ]      │
│ Status: EXECUTING_ROUTE              Status: IDLE_MONITORING           │
│ Pos: [-168.2, 65.0, 172.4]           Pos: [-65.0, 145.0, 101.0]        │
│ Leases: :legs[NAV] :gaze[PLAYER]     Leases: :gaze[SPACE]              │
│                                                                        │
│ Árvore Comportamental em Tempo Real (Tick 42108):                      │
│   ▼ :patrol-sanctuary [RUNNING]                                        │
│     ├── :inspect-quadrant-sw [SUCCESS]                                 │
│     └── ▼ :escort-leashed-mob [RUNNING]                                │
│           ├── :acquire-leash [SUCCESS]                                 │
│           ├── :traverse-portal-gate [RUNNING] <-- (50ms loop)          │
│           └── :confirm-containment [PENDING]                           │
│                                                                        │
│ Critic Event Log:                                                      │
│   [17:10:02] INSPECT_HABITAT ➔ Delta SW: +1 (deer contained)           │
│   [17:10:02] VERDICT: :goal-achieved (Confidence: 1.0)                 │
└────────────────────────────────────────────────────────────────────────┘
```

Pelo Studio, inspecionamos os nós das árvores comportamentais acendendo em tempo real, monitoramos a posse dos leases físicos e podemos realizar **hot-reload de arquivos `.edn`** contendo diálogos, regiões geográficas e parâmetros de roteamento sem derrubar os agentes.

Toda essa infraestrutura é respaldada por uma suíte rigorosa de Testes Orientados a Comportamento (TDD): são **67 testes automatizados e 890 asserções formais** cobrindo do Épico 0 ao Épico 7 (de `CA-001` a `CA-052`), executados em poucos segundos através do comando `make test`.

---

## 8. O Horizonte: De Guardiã de Santuário a Jogador Universal (AGI Incorporada) e Lições para Produção

Com a estabilização da Karlach e do Capitão Picard, comprovamos a viabilidade de agentes autônomos de processo duplo operando de forma nativa na JVM. O próximo passo da nossa pesquisa é expandir esses agentes de executores de rotas para **jogadores universais de mundo aberto** (*Open-Ended Embodied AGI*), capazes de sobreviver, minerar e construir autonomamente em qualquer ambiente.

Para nortear essa evolução, estruturamos a equivalência direta entre as capacidades legadas do ecossistema Mineflayer/PrismarineJS e a nossa implementação In-JVM:

### Tabela de Engenharia Reversa: Mineflayer (JS) vs. Craft-Agents (In-JVM)

| Capacidade | Repositório NPM Original | Arquivo / Função no Mineflayer | Implementação In-JVM no `craft-agents` | Vantagem Arquitetural In-JVM |
| :--- | :--- | :--- | :--- | :--- |
| **Coleta de Recursos** | `mineflayer-collectblock` | `CollectBlock.js`<br>`bot.collectBlock.collect()` | [`SyntheticPlayerFactory.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/fabric/SyntheticPlayerFactory.java)<br>`LOCATE_ITEM` + `ServerWorld.getEntitiesByType()` | **Zero Packet Lag:** Detecção da entidade no tick exato de spawn, sem latência de decodificação. |
| **Fisiologia & Auto-Eat** | `mineflayer-auto-eat` | `index.js`<br>`bot.autoEat.eat()` | [`SyntheticPlayerFactory.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/fabric/SyntheticPlayerFactory.java)<br>`HEALTH_STATUS` + `player.getHungerManager()` | **Acesso Fiel:** Leitura direta de exaustão e saturação sem depender de pacotes `update_health`. |
| **Combate Tático** | `mineflayer-pvp` | `PVP.js`<br>`bot.pvp.attack()` | [`SyntheticCombat.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/fabric/SyntheticCombat.java)<br>`ATTACK` + `player.getAttackCooldownProgress()` | **Sincronia 20 Hz:** Respeito rigoroso à barra de recarga de ataque da versão 1.21.1; knockback oficial. |
| **Bloqueio com Escudo** | `mineflayer-pvp` | `PVP.js`<br>`bot.activateItem(true)` | [`SyntheticPlayerFactory.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/fabric/SyntheticPlayerFactory.java)<br>`player.setCurrentHand(Hand.OFF_HAND)` | **Deflexão Real:** O escudo sobe no instante da colisão física de flechas ou ataques adversários. |
| **Cinemática de Saltos** | `mineflayer-pathfinder` | `movements.js`<br>`Movements.canJump()` | [`MovementCapabilities.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/nav/MovementCapabilities.java) + [`PathSolver3D.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/nav/PathSolver3D.java) | **Geometria Autêntica:** Checagem contra caixas de colisão `VoxelShape` reais de blocos e mods. |
| **Quedas Seguras** | `mineflayer-pathfinder` | `movements.js`<br>`Movements.canDropDown()` | [`PathSolver3D.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/nav/PathSolver3D.java)<br>`maxDropDown = 3` + `CollisionType.LIQUID` | **Dano Zero:** Avaliação da profundidade real de lâminas d'água antes da tomada de decisão de salto. |
| **Scaffolding Dinâmico** | `mineflayer-pathfinder` | `movements.js`<br>`Movements.scaffoldingBlocks` | [`fabric.clj`](file:///home/pace/dev/craft-agents/src/clj/craft/agents/backend/fabric.clj)<br>`{:op :scaffold :target [x y z]}` | **Sem Ghost Blocks:** Materialização atômica do bloco no `ServerWorld`, sem rejeição pelo servidor. |
| **Mineração Segura** | `mineflayer` (Core) | `digging.js`<br>`bot.dig()` | [`SyntheticPlayerFactory.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/fabric/SyntheticPlayerFactory.java)<br>`MINE_BLOCK` + `world.breakBlock()` | **Segurança Geométrica:** Bloqueio formal contra minerar o bloco sob os próprios pés. |
| **Crafting & Receitas** | `prismarine-recipe` | `craft.js`<br>`bot.craft()` | [`composer.clj`](file:///home/pace/dev/craft-agents/src/clj/craft/agents/skills/composer.clj)<br>`server.getRecipeManager()` | **Suporte Dinâmico:** Compatibilidade nativa com receitas registradas por qualquer mod instalado. |
| **Metas de Navegação** | `mineflayer-pathfinder` | `goals.js`<br>`GoalNear`, `GoalBlock`, `GoalXZ` | [`Goal3D.java`](file:///home/pace/dev/craft-agents/src/java/com/craft/agents/nav/Goal3D.java) (`GoalNear`, `GoalXZ`, `GoalPortal`) | **Zero-Allocation:** Classes imutáveis avaliadas sem instanciar novos vetores no heap. |

### O Roteiro em Quatro Épicos rumo à Autonomia Completa

Com essa fundação, nosso backlog arquitetural organiza-se em quatro fases:
1. **Épico I: Homeostase e Autopreservação (The Survival Loop):** Fisiologia e consumo automático de alimentos (`Auto-Eat`), manutenção de tochas em áreas escuras para impedir o surgimento de monstros e combate defensivo (*kiting*).
2. **Épico II: Cinemática 3D Universal (The Universal Mover):** Saltos parabólicos com verificação de espaço superior (*headroom clearance*), quedas amortecidas em água e construção dinâmica de pontes e degraus (*scaffolding*).
3. **Épico III: Mineração e Árvore de Produção GOAP (The Crafter & Miner):** Grafo formal de dependências em EDN (`tech_tree.edn`) para planejamento de ferramentas a partir de matéria-prima bruta (*Madeira ➔ Bancada ➔ Picareta ➔ Fornalha ➔ Ferro*).
4. **Épico IV: Auto-Curriculum e SLAM Espacial (The Open-Ended AGI):** Mapeamento volumétrico em octree de pontos de interesse (*POIs*), autoproposta de metas por curiosidade intrínseca e cooperação contínua com jogadores humanos.

### Síntese: O Que a Engenharia de Games Ensina aos Sistemas em Produção

Desenvolver o `craft-agents` reforçou uma lição que ultrapassa o universo do Minecraft:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ DA ENGENHARIA DE JOGOS AOS SISTEMAS DISTRIBUÍDOS                       │
│                                                                        │
│ Desafio no Jogo          Decisão Arquitetural   Equivalente Corporativo│
│ ───────────────────────  ─────────────────────  ───────────────────────│
│ 210 MB de RAM por bot    Modo Server-Native     In-Memory Computing e  │
│ duplicando chunks        Zero-Copy na JVM       eliminação de pontes   │
│                                                 de rede desnecessárias │
│                                                                        │
│ Bot em coma por 40 ticks Cognição Tri-Temporal  Desacoplamento entre   │
│ esperando a LLM pensar   System 0/1/2           tempo real e controle  │
│                                                 estratégico assíncrono │
│                                                                        │
│ Risco de loop e crash    Skill Library em EDN   Contratos fail-closed  │
│ gerados por eval() livre com Gatekeeper Malli   e restrição de DSLs    │
│                                                 declarativas de dados  │
│                                                                        │
│ Alucinação de que a      Environmental Critic   Auditoria empírica de  │
│ missão foi concluída     com verificação 3D     efeito colateral vs.   │
│                                                 confiança cega em logs │
└────────────────────────────────────────────────────────────────────────┘
```

Tratar mundos virtuais complexos com o mesmo rigor dispensado a sistemas distribuídos de alta frequência nos lembra que **inteligência autônoma duradoura depende de uma engenharia de sistemas sólida**. Ao trazer a mente do Voyager para dentro da JVM moderna com Clojure e Java 21, liberamos nossos agentes do passado — e demos o primeiro passo rumo a uma IA verdadeiramente incorporada.

---

### Referências e Leituras Recomendadas

1. **Serrano, P. C. (2026).** *Hackeando o Runtime do Minecraft ao Vivo: Hotpatching de JVM, ASM e Manipulação de Estado sem Reiniciar o Servidor.* [patrickcmserrano.github.io/blog](file:///home/pace/dev/patrickcmserrano.github.io/static/posts/2026-10-25-hackeando-runtime-jvm-minecraft-hotpatch-asm.pt.md)
2. **Wang, G., Xie, Y., Jiang, Y., Mandlekar, A., Xiao, C., Zhu, Y., Fan, L., & Anandkumar, A. (2023).** *Voyager: An Open-Ended Embodied Agent with Large Language Models.* arXiv preprint [arXiv:2305.16291](https://arxiv.org/abs/2305.16291).
3. **Mineflayer Community.** *Mineflayer: Create Minecraft bots with a powerful, stable, and high level JavaScript API.* [PrismarineJS/mineflayer](https://github.com/PrismarineJS/mineflayer).
4. **Kahneman, D. (2011).** *Thinking, Fast and Slow.* Farrar, Straus and Giroux.
5. **Fabric Project.** *Fabric: A modular, lightweight modding toolchain for Minecraft.* [fabricmc.net](https://fabricmc.net).

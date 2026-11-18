# Do Teleporte ao Corpo Físico na JVM: Física Nativa em 15 Agentes, Combate Balístico, Shaders Relativísticos e um Leak de 5,3 GB no Netty

*Como evoluímos o `craft-agents` em duas semanas intensas (mais de 400 commits e 615 testes): da auditoria arquitetural que eliminou teleportes sintéticos com um árbitro único de atuadores (`npc.body`) e física no `ServerThread` (`STEP`), passando por sniper balístico com mira preditiva, autodefesa de assento e um motor de shaders analíticos com Buraco Negro e efemérides orbitais — até a caça ao vivo de um vazamento de memória direta no Netty.*

Em [4 de novembro, publicamos o artigo inaugural do `craft-agents`](/blog/2026-11-04-da-lisp-machine-a-agi-incorporada-craft-agents-voyager-jvm/), detalhando como abandonamos o Mineflayer em Node.js em favor de agentes `ServerPlayerEntity` nativos na JVM com Clojure, busca A* 3D em 64 bits (`PackedPos`) e contratos formais em Malli sem `eval()`.

Naquele momento, tínhamos um protótipo funcional com dois personagens principais (Karlach e Picard) e ~118 testes. Mas colocar um protótipo para rodar em um servidor multiplayer vivo expõe imediatamente as rachaduras entre a teoria e a engenharia de produção: bots que andavam "no ar" via teleporte, disputas silenciosas pelo controle do mesmo corpo no mesmo tick, gargalos na ponte TCP e um bug severo em um mod de terceiros que derrubava o servidor a cada dez horas.

Entre 04 e 18 de novembro de 2026, o projeto passou por uma transformação profunda em seis frentes simultâneas — acumulando **359 commits só no `craft-agents`**, outros **37 no `craft-repl`**, e expandindo a suíte automatizada para **615 testes e 6.147 asserções** (590 testes / 5.931 asserções no `craft-agents` e 25 testes / 216 asserções em Clojure + 12 testes JS no `craft-repl`), com **15 agentes autônomos operando em paralelo** com física real.

Este é o relato técnico detalhado de tudo o que mudou.

---

## 1. Consolidação do Workspace e Auditoria Arquitetural (`CA-097`)

O primeiro passo foi organizar a casa. Em **10 de novembro**, seis repositórios que viviam espalhados foram consolidados em um workspace único (`/home/pace/dev/minecraft/`), governado por contratos operacionais rígidos (serviços `systemd --user`, scripts ad-hoc exclusivamente em Babashka `bb`, e pipeline TDD isolado por worktree):

```text
/home/pace/dev/minecraft/
├── craft-agents/                   # Núcleo cognitivo (Clojure 1.12 + Java 21) & Studio (:8095)
├── craft-repl/                     # JVM Attach injector, nREPL (:7888), builders & dashboard (:8090)
├── server/                         # Servidor Fabric 1.21.1 (:25565), BlueMap (:8100), Simple Voice
├── dashboard/                      # MC Dashboard Python (:8090) com parser NBT nativo
├── alien-sky-sync/                 # Mod Fabric client-side (hotkeys & auto-sync de shaders/packs)
└── alien-sky-pack-distribution/    # Pacotes de distribuição do motor AlienWorld Sovereign
```

Quatro dias depois (14/11), conduzimos uma auditoria brutalmente honesta em `docs/reports/arch-review-01.md` (*552 linhas, tarefa CA-097*), comparando o código vivo com a tese "Voyager na JVM". O diagnóstico revelou três problemas estruturais que travavam a escala para dezenas de agentes:

1. **Monolitos acoplados:** `engine.clj` havia crescido para 1.395 linhas e `goals.clj` para 773 linhas, misturando lógica de personagem específico da Karlach com capacidades universais de corpo e sobrevivência.
2. **Concorrência motora sem árbitro:** Subsistemas diferentes (follow, patrulha, watchdog, combate) disparavam strings `"MOVE|..."` diretamente contra o socket da ponte no mesmo tick, causando *jitter* e sobrescrita de intenção.
3. **Percepção pulverizada:** Cada bot consultava o estado do mundo individualmente na ponte, multiplicando o tráfego síncrono por tick.

Desse relatório nasceram três sprints consecutivas em cascata: **`npc-core-01`**, **`body-01`** e **`physics-01`**.

---

## 2. Um Dono por Atuador: `npc.body`, Leases e Snapshot Único (`npc-core-01` & `body-01`)

Na sprint `npc-core-01` (`CA-084..CA-096`), quebramos os namespaces gigantes em sub-namespaces especializados sob fachadas com macro de re-export (mantendo compatibilidade para redefinição ao vivo via nREPL). As capacidades de fala (`npc.speech/say!`), registro validado por Malli (`npc.registry`), estado isolado por agente (`npc.state`) e despacho polimórfico de metas (`goals.dispatch`) deixaram de pertencer a um único NPC e passaram a servir todo o elenco declarado em `agents/*.edn`.

Em seguida, na sprint `body-01` (`CA-098..CA-105`), implementamos a invariante central de controle motor em `craft.agents.npc.body`:

* **Quatro canais independentes:** `:legs`, `:gaze`, `:hands` e `:pose`.
* **Arbitragem determinística por prioridade:** `:survival` (`100`) > `:combat` (`80`) > `:player-goal` (`60`) > `:bt` (`40`) > `:atelier` (`20`) > `:idle` (`0`). Em caso de empate no mesmo tick, vence a primeira intenção registrada.
* **Emissão única via `flush!`:** Todos os subsistemas apenas solicitam intenções (`request!`). Apenas `npc.body` tem permissão para serializar comandos de movimento no fio, emitindo no máximo um comando por agente por tick.
* **Guarda estrutural em teste:** Um teste automatizado inspeciona o código-fonte e falha caso qualquer outro namespace tente formatar o literal `"MOVE|"` diretamente.

```clojure
(def channels #{:legs :gaze :hands :pose})

(def priorities
  {:survival 100 :combat 80 :player-goal 60 :bt 40 :atelier 20 :idle 0})

(defn arbitrate
  "Mantem a intencao vigente ou a nova conforme a prioridade (empate: a vigente)."
  [current incoming]
  (if (or (nil? current)
          (> (priority-of (:source incoming)) (priority-of (:source current))))
    incoming
    current))
```

Simultaneamente, introduzimos o `craft.agents.npc.perception-tick`, que captura um **snapshot único de percepção por tick** para todos os agentes e registra telemetria contínua de latência (`:tick-ms`) e volume de comandos (`:cmds-per-tick`).

---

## 3. Do Teleporte à Física Corporal Real: Sprint `physics-01` (`CA-068..CA-130`)

Até o início de novembro, mover um agente sintético significava chamar `refreshPositionAndAngles` via comando `MOVE`. Por que os bots não caíam em buracos, não sofriam atrito e tinham flechas cravadas que nunca expiravam?

O diagnóstico na JVM revelou a causa raiz: no Minecraft vanilla, quem executa `LivingEntity.tick()` (física, gravidade, fluidos, colisão) é o `ServerPlayNetworkHandler.tick()` de uma conexão registrada. Como nossos agentes usam `SilentEmbeddedChannel` sem conexão registrada na rede, **o motor físico nunca rodava para eles**.

Na sprint `physics-01`, substituímos o teleporte sintético pela execução física real em quatro camadas:

```text
[Clojure Engine 20 Hz] ──► STEP|nome|tx|ty|tz|yaw|pitch|sprint|sneak|jump
                                  │
                                  ▼ (trava intenção com TTL = 10 ticks)
                       [ PhysicsLatch (Java) ]
                                  │
                                  ▼ (gancho de fim de tick no ServerThread)
                       [ PhysicsRunner.tickAll() ]
                          ├── PhysicsMath (decisões puras sem deps do MC)
                          ├── mergeKnockback (soma intenção + inércia vanilla)
                          ├── LivingEntity.travel(Vec3d) & Entity.move()
                          └── syncPose (STANDING / CROUCHING / SWIMMING / FALL_FLYING)
```

1. **Decisões puras testáveis em `PhysicsMath.java`:** Como código acoplado a classes ofuscadas/intermediary do Minecraft não roda fora do servidor, isolamos toda a matemática cinemática em métodos estáticos puros (`PhysicsMath.horizontalToward`, `mergeKnockback`, `yawToward`, `shouldSleep`, `plan`) — permitindo que o Clojure os teste diretamente via interop no `make test`:
   * Velocidades reais do jogador: `WALK_SPEED = 0.1`, `SPRINT_SPEED = 0.13`, `SNEAK_SPEED = 0.03` blocos/tick.
   * **Sono de física (`shouldSleep`):** Se o bot está apoiado (`GROUND_REST_VY = -0.0784`) e sem intenção nova após `INTENT_TTL_TICKS = 10`, a velocidade horizontal zera para poupar CPU, mas gravidade e checagem periódica de suporte (`SUPPORT_CHECK_PERIOD_TICKS = 4`) permanecem ativos.
2. **Preservação de Knockback (`CA-069`):** Em combate, o impulso vanilla acumulado (`getVelocity()`) é preservado e fundido ao vetor de intenção via `mergeKnockback`, decaindo naturalmente pelo atrito do `travel()`.
3. **Locomoção em Malha Fechada (`CA-129`):** O executor `advance-path` lê a posição autoritativa devolvida pelo `STEP`, salta obstáculos acima de `JUMP_DY_THRESHOLD = 0.6` blocos e detecta `horizontalCollision` para replanejar a rota A* instantaneamente — aposentando o antigo hack estático `GROUND`.
4. **Sincronização de Posturas (`syncPose`):** Corrige poses presas (como `FALL_FLYING` após voo de elytra ou `SWIMMING` fora d'água) no instante em que o bot toca o solo seco.

Em **17 de novembro (`CA-130`)**, ativamos `:agent/physics? true` inicialmente para a Karlach no Santuário e, validada a estabilidade de MSPT, ligamos a física corporal nativa para **todos os 15 agentes do elenco**: Aang, Agott, Antigravity, Asta, Coco, Gundam, Kakashi, Karlach, Picard, Qifrey, Richeh, Rimuru, Shanks, Tetia e Veldora.

---

## 4. Combate Balístico (`GunFire`), Autodefesa de Assento e Mineração Cooperativa

Com o corpo físico ativo e o elenco expandido para 15 personagens com rotinas próprias (Santuário, Ponte da Enterprise, Atelier de Bruxas e Escritório), novas capacidades táticas foram acopladas ao runtime:

### A. Gundam Sniper & Balística JEGN
Integramos o mod *Just Enough Guns* diretamente à ponte Java através de `GunFire.java` (271 linhas) e dos opcodes `SHOOT_GUN`, `RELOAD_GUN` e `GUN_STATUS`:
* `GunFire.tick` é conectado ao `PhysicsRunner.tickAll` no loop do servidor, avançando animações de recarga (`inventoryTick`) e cooldowns balísticos (`ItemCooldownManager.update`).
* O **Gundam** opera com fuzil de assalto em alcance de engajamento de **24 metros**, utilizando **mira preditiva NT-D**, compensação de queda balística e modo ADS (*Aim Down Sights*).

### B. Autodefesa de Agentes Sentados (`seated-defense` — 18/11)
Bots descansando em cadeiras ou sofás (`another_furniture` / `SyntheticSeatManager.java`) não ficam mais vulneráveis. Nos commits mais recentes de **18 de novembro (`3875bc1` → `7e1429c`)**:
* Agentes em `:mode :seated` mantêm varredura ativa em raio de **28 a 36 metros**.
* Ao detectar hostis, emitem `STAND|<nome>`, entram no estado `:seated-defense`, correm com física real e atacam usando **distância Euclidiana 3D estrita** (evitando que o agente golpeie o chão ao lutar contra mobs em desnível).
* Eliminada a ameaça, o agente traça uma rota A* 3D de retorno ao assento original (`:seat-pos`), tolerando desníveis verticais de até `1.2m` e contando com um *watchdog* de resgate por teleporte (com partículas e som de portal) caso caia em ravinas sem caminho (`ERR|NO_PATH` ou `stuck > 40`).

### C. Mineração Cooperativa, Swarm Claims e Proteção de Piso
No módulo `engine/mining.clj` e `SyntheticExcavation.java`:
* **Separação ontológica:** Escavar com pá (terra, grama, areia, vidro) vs. minerar com picareta (pedra, minérios expostos) vs. corte florestal com machado (varredura vertical de copas altas sem deadlock).
* **Swarm Claims (14 slots):** Reserva cooperativa de blocos alvo em `SharedSwarmWorld.java`, evitando que vários agentes compitam pelo mesmo bloco e eliminando congelamentos.
* **Proteção de pegada (*Footprint Protection*):** Impede que o minerador quebre o bloco exatamente sob seus próprios pés durante escavações verticais.

---

## 5. Cognição Sub-milissegundo, Roteador Semântico e Crítico Ambiental

Para manter o custo de tokens em zero na operação contínua a 20 Hz, a camada cognitiva ganhou componentes determinísticos e vetoriais na JVM:

1. **Roteador Semântico Vetorial (`< 1 ms` por inferência):** Em `cognition/semantic_router.clj`, implementamos um classificador de intenções baseado na arquitetura *Aurelio AI / RouteLLM*, usando vetorização de termos e **n-grams de subpalavras (3-grams e 4-grams)** com normalização NFD e similaridade de cosseno. Isso garante resistência a erros de digitação, gírias e conjugações verbais sem depender de LLM externo no caminho crítico.
2. **Environmental Critic & Negative Ledger (`critic.clj` & `ledger.clj`):** O crítico ambiental da tríade Voyager valida o estado real (*ground truth*) do Santuário de Fauna Silvestre por quadrante (Pandas no NE, Elefantes no SE, Capivaras no SW, Ártico no NW), eliminando alucinações de sucesso em malha aberta e registrando falhas em memória negativa persistente.
3. **Skill Composer com Gatekeeper Malli (`skills/composer.clj`):** Permite compor novas skills em EDN via MCP com detector de ciclos, Skill-RAG e árvores multimodais de 4 estágios (como `follow-player-multimodal-tree`, que transiciona entre caminhada, embarque em veículos/barcos, nado e teleporte).

---

## 6. Astrofísica Analítica e Shaders Relativísticos (`AlienWorld Sovereign v4.2`)

A experiência visual do servidor também ganhou engenharia pesada. Em vez de depender de *shaderpacks* baseados em *Screen-Space Reflections* (SSR) e múltiplos passes pesados de pós-processamento (`deferred`/`composite`), construímos o **AlienWorld Sovereign Shader Engine v4.2**:

* **Motor Celeste Analítico em Forma Fechada (`f(ω, t)`):** Todo o domo celeste, espalhamento atmosférico e reflexos são avaliados analiticamente, com *Dynamic Bounding-Cone Culling* descartando ~92–95% dos raios fora do cone planetário.
* **Efemérides Sincronizadas (`CA-050`):** O módulo Clojure `astrophysics/ephemeris.clj` e o shader `ephemeris.glsl` compartilham exatamente o mesmo modelo orbital determinístico: ciclo de 84.000 ticks (3,5 dias do Minecraft), inclinação orbital de 28° e duas luas em ressonância de Laplace 2:1.
* **Buraco Negro Relativístico (`blackhole.glsl`):** Renderiza deflexão gravitacional de Einstein (`rEinstein = 0.042`), sombra de Schwarzschild (`rS = 0.016`), esfera de fótons (`rPhoton = 0.024`) e disco de acreção com efeito Doppler.
* **Hidrodinâmica Analítica (`water_optics.glsl`):** Ondas de Gerstner de 4 oitavas traçam raios refletidos diretamente no céu analítico (zero glitches de SSR em qualquer inclinação de câmera), preservando vitrines verticais de aquários lisas e clareando águas interiores iluminadas por tochas/lanternas.
* **5 Sistemas Planetários e Companion Mod (`alien-sky-sync`):** Alternância instantânea entre *Titã Soberano*, *Trono de Órion (M42)*, *Nibiru*, *Proxima Centauri b* e *Sirius AB*, com hotkeys in-game (`B`, `N`, `M`, `V`, `L`) e sincronização automática de resource packs via dashboard.

---

## 7. SRE em Produção: O Leak de 5,3 GB no Netty e Alta Disponibilidade

Por fim, duas melhorias críticas de infraestrutura estabilizaram o servidor em operação contínua:

### A. Caça ao Memory Leak no Mod de Webcam (`webcam-fabric-4.4.0+leakfix`)
Com o servidor rodando por ~10 horas e 2–3 jogadores com webcams ativas, o event loop do `Webcam Server` travava em `java.nio.Bits.reserveMemory`, derrubando os clientes em loop de reconexão.

Inspecionando a JVM viva via nREPL com `PooledByteBufAllocator.DEFAULT.metric()`, encontramos a prova cabal (documentada em `server/docs/upstream-issue-webcam-bytebuf-leak.md`):

```text
JDK pool direct count=1464 used=5367142858
arena0 activeAllocations=6086624 activeBytes=5268045824 allocations=6129023 deallocations=42399
```

Eram **6,08 milhões de buffers diretos (~860 B cada)** somando **5,27 GB retidos** na arena 0. A causa raiz estava em `EncryptOutboundS2CHandler.java`: o método recebia um `retainedDuplicate()` de cada fragmento de vídeo, criptografava o conteúdo para um `byte[]`, alocava um novo pacote UDP e **nunca chamava `.release()` no `ByteBuf` original**. Compilamos um patch local (`webcam-fabric-4.4.0+leakfix-1.21.1.jar`) e redigimos o relatório formal para o repositório upstream.

### B. Espelhamento Standby Automático (`g15`)
No lado de operações, o script `server/scripts/sync-standby.sh` foi acoplado como `ExecStartPost` do `minecraft-backup.service`: após cada backup de mundo, toda a árvore de configuração do servidor e os 3 últimos snapshots comprimidos são sincronizados via `rsync`/SSH para o host de standby `g15`, garantindo recuperação rápida em caso de falha de hardware.

---

## Conclusão e Próximos Passos

Em duas semanas, saímos de agentes que apenas respondiam a comandos pontuais via teleporte para um sistema multi-agente completo rodando em JVM:

* **15 agentes autônomos** com física corporal real no `ServerThread`, postura sincronizada e zero comandos concorrentes graças ao árbitro `npc.body`.
* **615 testes e 6.147 asserções** cobrindo contratos arquiteturais, cinemática pura, combate balístico, autodefesa de assento e dashboards.
* **Infraestrutura blindada** contra vazamentos de memória nativa e com réplica automatizada em standby.

Com a camada física e os atuadores estabilizados em `physics-01`, o próximo passo natural no roteiro é fechar a malha do **System 2 (Voyager Loop)**: conectar o currículo automático em tempo ocioso diretamente a um gateway LLM local com orçamento controlado por agente, permitindo que o elenco componha e refine novas árvores BT em EDN de forma autônoma em produção.

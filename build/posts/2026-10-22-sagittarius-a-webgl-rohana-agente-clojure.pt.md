---
title: 'Sagittarius A* no Browser, Planeta Terra em Tempo Real e um Agente Clojure Vivo no Portfólio'
date: '2026-10-22'
tags: ['WebGL', 'Three.js', 'GLSL', 'Astrophysics', 'Rohana', 'Clojure', 'Pathom 3', 'SvelteKit']
summary: 'A física e os shaders GLSL por trás da simulação relativística de Sagittarius A*, o salto interestelar de 26.670 anos-luz até o Planeta Terra com terminador solar sincronizado em tempo real (UTC), o estúdio de narração em voz e a arquitetura da Rohana (Clojure + Pathom 3 + Turbovec) operando 24/7 no site.'
---

**Série AI Factory & Engenharia de Agentes — Parte 4 de 6**

Um portfólio de engenharia de software não deveria ser apenas um currículo estático em HTML dizendo *"eu sei construir sistemas complexos"*. Ele deveria **ser**, por si só, um sistema vivo que demonstra na prática essa filosofia de construção.

Ao redesenhar este espaço (**`patrickcmserrano.github.io`**) nos últimos meses, decidi unir duas paixões num único lugar:
1. **Astrofísica Computacional & Computação Gráfica em WebGL/GLSL:** transformar o plano de fundo do site num observatório astronômico interativo — começando no horizonte de eventos de **Sagittarius A\*** (o buraco negro supermassivo no centro da Via Láctea) e permitindo viajar **26.670 anos-luz** até uma simulação física em tempo real do **Planeta Terra**.
2. **Engenharia Conversacional em Clojure ([Rohana](/trabalho/rohana/)):** substituir formulários de contato frios por uma instância viva da **Rohana** (nosso motor multi-tenant desenvolvido na **Daelaam** sobre Clojure, Pathom 3, Datahike, Aeron IPC e Turbovec), combinada com uma experiência de leitura guiada na minha própria voz.

Neste artigo, abro a matemática, os shaders GLSL e a arquitetura de backend por trás de cada uma dessas peças.

---

## 🕳️ Parte I: Ray-Marching Relativístico de Sagittarius A* no Browser

Quando você abre a Home deste site — ou clica em **"Expandir Visualização"** no topo da página —, você não está vendo um vídeo em loop nem uma textura pré-renderizada. É uma simulação em tempo real rodando na sua GPU via **Three.js + GLSL customizado**, parametrizada com os dados astrofísicos reais de **Sagittarius A\*** publicados pela colaboração do *Event Horizon Telescope (EHT)* e do instrumento *GRAVITY (VLT)*:

* **Massa ($M$):** $4,297 \times 10^6\ M_{\odot}$ (quatro milhões e trezentas mil massas solares).
* **Distância à Terra:** $26.670\text{ anos-luz}$ ($8,178\text{ kpc}$ na direção da constelação de Sagitário).
* **Spin Adimensional de Kerr ($a_*$):** $\approx 0,90$, determinando diretamente o raio da **ISCO (*Innermost Stable Circular Orbit*)** em unidades gravitacionais $GM/c^2$:

$$Z_1 = 1 + (1 - a_*^2)^{1/3}\left[(1 + a_*)^{1/3} + (1 - a_*)^{1/3}\right], \quad Z_2 = \sqrt{3a_*^2 + Z_1^2}$$

$$r_{\text{ISCO}} = 3 + Z_2 - \sqrt{(3 - Z_1)(3 + Z_1 + 2Z_2)} \approx 2,32\ GM/c^2$$

### O Pipeline Óptico no Fragment Shader

Para manter **60 FPS** inclusive como plano de fundo ambiente sem derreter a bateria de notebooks, o shader integra quatro fenômenos físicos essenciais:

1. **Deflexão Gravitacional da Luz (*Gravitational Lensing*) e Esfera de Fótons:**
   Cada raio lançado pela câmera sofre curvatura geodésica ao passar próximo ao poço gravitacional ($r_s = 2GM/c^2$). Raios que cruzam o horizonte de eventos formam a **sombra do buraco negro** ($\approx 51,8\ \mu\text{as}$ vistos da Terra); raios que tangenciam a esfera de fótons dão voltas adicionais ao redor do buraco negro, projetando o **anel de fótons** secundário e dobrando a imagem do disco de acreção superior e inferior.
2. **Beaming Relativístico de Doppler ($\delta^3$):**
   O gás ionizado no disco de acreção orbita em velocidades relativísticas próximas a $c$. O lado do disco que se move na direção do observador sofre um intenso *blueshift* e amplificação de brilho pelo fator Doppler relativístico $\delta = [\gamma (1 - \beta \cos\theta)]^{-1}$, enquanto o lado que se afasta sofre *redshift* e escurecimento — produzindo a característica assimetria luminosa observada pelo EHT.
3. **Modo Espectral Duplo (Visível vs. EHT 230 GHz):**
   No painel astrofísico, você pode alternar em tempo real entre o **Espectro Visível** (com gradiente térmico de corpo negro e deslocamento espectral de Doppler) e a reconstrução radiométrica **EHT 230 GHz ($1,3\text{ mm}$)**, que simula a resolução angular efetiva da interferometria VLBI e a paleta de temperatura de brilho do Event Horizon Telescope.
4. **Fundo Galáctico Real (NASA SVS Deep Star Maps 2020):**
   O céu ao redor de Sagittarius A* utiliza o mapa estelar profundo em coordenadas galácticas da NASA, com mapeamento de tom exponencial (`1.0 - exp(-lin * 1.15)`) e distorção direta pela lente gravitacional do buraco negro.

---

## 🌍 Parte II: O Salto de 26.670 Anos-Luz até o Planeta Terra em Tempo Real

Ao ativar o marcador **`🌍 Terra`** na visualização de Sagittarius A*, o HUD aponta para a direção exata do Sistema Solar no Anti-centro Galáctico ($l = 180^\circ, b = +0,14^\circ$). Clicar em **`🚀 Viajar`** dispara uma dobra interestelar até a órbita da Terra ([`EarthView.svelte`](/trabalho/small-router/)).

Para que a visualização da Terra tivesse o mesmo rigor físico do buraco negro, implementei três camadas astronômicas e atmosféricas em GLSL:

```text
Relógio UTC Real (Date.now)
       │
       ▼
[Série de Fourier de Spencer]
 • Declinação Solar (δ_☉ ∈ [-23.44°, +23.44°])  ──▶ Inclinação sazonal exata dos polos
 • Equação do Tempo (EoT) + Longitude Subsolar  ──▶ Fuso horário real do meio-dia solar
       │
       ▼
[Vetor Solar 3D (uSunDir) + Shaders Físicos]
 • Massa Óptica Atmosférica (Air Mass Kasten-Young): AM = 1 / (sin(el) + 0.042)
 • Extinção Espectral de Rayleigh + Ozônio (Chappuis): exp(-β_ext * (AM - 1))
 • Penumbra Azul-Cobalto no Crepúsculo Civil (0° a -6°) + Luzes Urbanas Noturnas
```

1. **Linha do Terminador Sincronizada com os Fusos Horários Reais (`UTC` / `BRT`):**
   No modo padrão (**Tempo Real**), a posição do Sol não é arbitrária: calculamos a cada quadro a **Declinação Solar ($\delta_{\odot}$)** do dia do ano e a **Longitude Subsolar ($\lambda_{\odot}$)** via Equação do Tempo. Se são `16:50 BRT (UTC-3)` em **Niterói / Rio de Janeiro (`22.9°S, 43.1°W`)**, você verá a linha do pôr do sol cruzando o Oceano Atlântico rumo à costa brasileira em tempo real, enquanto a Europa e a África já estão com as luzes noturnas acesas.
2. **Física Realista na Linha do Terminador (Sem Faixa Laranja Artificial):**
   Vista do espaço (como nas imagens da ISS ou do satélite DSCOVR EPIC), a transição entre o dia e a noite não tem uma linha laranja pintada no chão. Nosso shader calcula a **Massa Óptica Atmosférica ($AM$)** que o raio solar atravessa ao tangenciar a curvatura da Terra ($AM \to 24$ no horizonte). A extinção de Rayleigh filtra naturalmente os comprimentos de onda azuis e verdes da luz solar direta, dourando apenas as encostas de cordilheiras (via *normal map* topográfico), o reflexo especular nos oceanos e o topo das nuvens altas (que permanecem iluminadas até $\sim 2,5^\circ$ além do terminador de superfície), seguido pela penumbra azul-cobalto do crepúsculo civil.
3. **Camada de Nuvens sem Costura e Luzes Urbanas Isoladas:**
   As nuvens projetam sombras dinâmicas sobre continentes e oceanos (com sombras mais longas perto do pôr do sol), e o mapa noturno passa por um filtro espectral no shader que isola exclusivamente a emissão incandescente das manchas urbanas sobre o fundo escuro dos continentes.

---

## 🎙️ Parte III: Leitura Guiada na Voz do Autor

Enquanto escrevia os artigos desta série, tive uma ideia simples: *e se o leitor pudesse ouvir a minha própria voz lendo cada seção do artigo, enquanto a página destaca e acompanha automaticamente o trecho narrado?*

Construí diretamente no modo de desenvolvimento do blog (`vite.config.ts` + `[slug]/+page.svelte`) um **Estúdio de Gravação por Seção**:
* Quando rodo o site localmente (`localhost`), cada título (`h1`, `h2`, `h3`) ganha controles de gravação (`● Gravar`, `■ Parar`, `▶ Ouvir`, `🗑️`).
* O áudio capturado pelo microfone em `audio/webm;codecs=opus` é salvo diretamente em `static/audio/blog/<slug>/NN-<section-id>.webm` com um manifesto `manifest.json`.
* Em produção, para os leitores, os artigos que possuem gravação exibem a barra **"🎧 Ouvir artigo na voz do autor"**: ao dar play, o blog avança automaticamente de seção em seção, fazendo *scroll* suave e iluminando no texto exatamente o capítulo que estou narrando no momento.

---

## 🤖 Parte IV: Rohana (Daelaam) — Arquitetura Clojure Multi-Tenant do Código à Rua

No canto inferior direito desta página vive a **[Rohana](https://patrickcmserrano.github.io/rohana/)**, o motor de IA conversacional que desenvolvi na **Daelaam** (**91 commits** no último trimestre, consolidando o *rebranding* definitivo do projeto que nasceu sob o codinome *Khala*).

Diferente de *wrappers* frágeis feitos em cima de frameworks da moda, a Rohana foi projetada como um sistema de engenharia em **Clojure** com isolamento estrito por *tenant*:

```text
Visitante (Web Widget / WhatsApp / Telegram @rohana_ia_bot)
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROHANA ENGINE (Clojure / Daelaam)                    │
│                                                                         │
│  1. Guardrail Determinístico Pré-I/O ──▶ Bloqueia Prompt Injection      │
│                                          ANTES de tocar DB ou LLM       │
│  2. Anonimização Presidio            ──▶ Redação de PII c/ Allowlist EDN│
│  3. Resolução Declarativa (Pathom 3) ──▶ Grafo de Contexto por Tenant   │
│  4. Memória & Vetores                ──▶ Datahike + Aeron IPC + Turbovec│
│  5. Grounding Estrito por Citação    ──▶ Resposta ancorada + Handoff    │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Configuração 100% Declarativa em EDN:** Cada cliente (*tenant*) — seja uma clínica odontológica ou o tenant `:patrick` que atende neste portfólio — é definido puramente por arquivos EDN, sem misturar dados, prompts ou índices entre clientes.
2. **Defesa Antes de Qualquer I/O:** Tentativas de *prompt injection*, *jailbreak* ou extração de prompt de sistema são barradas por um classificador determinístico **antes** de qualquer consulta ao Datahike ou chamada de LLM — validado continuamente por uma suíte automatizada de *red-team*.
3. **Stack de Baixa Latência (Pathom 3 + Datahike + Aeron IPC + Turbovec):** O contexto de cada turno é resolvido como um grafo declarativo via **Pathom 3**, consultando fatos transacionais no **Datahike** e busca semântica de alta velocidade no **Turbovec** comunicando-se via **Aeron IPC**.
4. **Validação no Mundo Real (Go-To-Market em Niterói):**
   Tecnologia boa precisa sobreviver ao mundo fora do terminal. Em outubro, estruturamos nossa operação comercial focada na vertical de clínicas odontológicas em Niterói/Icaraí: mapeamos **93 clínicas** via consultas geoespaciais no Overpass (OpenStreetMap), fomos pessoalmente a campo em **19 abordagens presenciais documentadas**, refinamos o discurso a partir das objeções reais das recepções e conquistamos nosso primeiro *lead* quente em operação.

---

## 🏁 Conclusão: Software com Identidade

Seja simulando a curvatura do espaço-tempo ao redor de um buraco negro de 4,3 milhões de massas solares, calculando a extinção atmosférica de Rayleigh do pôr do sol sobre a Baía de Guanabara ou orquestrando grafos de resolução com Pathom 3 em Clojure, a filosofia é a mesma: **entender os primeiros princípios físicos e matemáticos do problema e construir software enxuto, rápido e auditável.**

---

### 🔜 No Próximo Artigo da Série...

Na **[Parte 5 desta série](/blog/2026-10-22-techsentry-scraping-sobrevivencia-clojure-terrenos-leiloes/)**, vamos mergulhar no mundo sujo dos dados da vida real com o **[`TechSentry`](/trabalho/techsentry/)**: como usamos **Clojure, Datahike, Pathom 3 e Etaoin** para garimpar e validar **19.528 terrenos no estado do Rio de Janeiro**, contornar limites silenciosos de paginação da OLX fatiando o estado por faixas de preço, filtrar leilões de carros e caçar iPhones às 4 da manhã via `systemd`.

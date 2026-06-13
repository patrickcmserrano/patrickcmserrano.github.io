# Patrick Campelo Serrano — Engenharia de Software

Website oficial de portfólio pessoal, blog de engenharia de software e agregador de links, construído com arquitetura moderna de geração de site estático (SSG).

## 🚀 Stack Tecnológica

O website foi totalmente re-arquitetado para utilizar o estado da arte do ecossistema front-end:

*   **Core:** [SvelteKit 2](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/) (usando a nova sintaxe de Runes)
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (compilação nativa ultra-rápida via CSS-first config)
*   **Design System:** [Skeleton Labs UI v3](https://skeleton.dev/) (Preset de tema Mona adaptado)
*   **Internacionalização:** Sistema customizado reativo e leve em [simple-i18n.ts](src/lib/simple-i18n.ts) com suporte a Português (`pt`), Inglês (`en`) e Espanhol (`es`).
*   **Deployment:** Hospedado no GitHub Pages com deploy automático (CI/CD) via GitHub Actions.

---

## 🗺️ Estrutura de Rotas e Páginas

O site está estruturado nas seguintes rotas:

1.  **`/` (Home):** Landing page principal contendo a bio curta, chamada para ação (CTAs), seção de Projetos em Destaque e Artigos Recentes do Blog.
2.  **`/about` (Sobre Mim):** Página biográfica detalhada contendo:
    *   **Biografia:** Trajetória pessoal e decisões de design.
    *   **Habilidades Técnicas:** Linguagens, Frameworks e Infraestrutura.
    *   **Experiência Profissional:** Linha do tempo interativa detalhando as realizações em engenharia.
    *   **Formação Acadêmica:** Formação formal e projetos acadêmicos.
    *   **Contato:** Links diretos para GitHub, LinkedIn e E-mail.
3.  **`/trabalho` (Projetos & Cases):** Portfólio de engenharia focado nos projetos principais:
    *   **TechSentry:** Price watcher distribuído resiliente (Clojure, Datahike, NATS JetStream, Event Sourcing).
    *   **Ark Engine:** Infraestrutura bitemporal de trading algorítmico (Clojure, XTDB, Redis Streams, Polylith).
    *   **Ark Streams:** Pipeline de alto desempenho para ingestão de ticks de mercado (Go, NATS JetStream, InfluxDB).
4.  **`/blog` (Blog Técnico):** Artigos profundos sobre programação funcional, sistemas distribuídos e diários de desenvolvimento semanais. Os posts são escritos em Markdown e compilados dinamicamente no build.
5.  **`/links` (LinkFlow):** Agregador de links mobile-first (estilo Linktree) integrado com um player de música atmosférico do YouTube.

---

## 📂 Organização do Repositório

```
📦 patrickcmserrano.github.io
├── 📂 .github/workflows/      # Pipelines de CI/CD (Deploy de App e Testes)
├── 📂 static/
│   ├── 📂 images/             # Imagens de perfil, ícones e assets estáticos
│   ├── 📂 posts/              # Arquivos Markdown (.md) dos artigos do blog
│   ├── posts.json             # Banco de dados indexado dos posts do blog
│   └── links.json             # Configurações do agregador LinkFlow
├── 📂 src/
│   ├── 📂 components/         # Componentes compartilhados (Tema, Idioma, Player)
│   ├── 📂 data/
│   │   └── projects.json      # Dados dos projetos exibidos no portfólio
│   ├── 📂 lib/
│   │   └── simple-i18n.ts     # Engine de tradução reativa (Svelte Store)
│   └── 📂 routes/             # Páginas e roteamento do SvelteKit
│       ├── +page.svelte       # Home principal
│       ├── 📂 about/          # Página Sobre Mim
│       ├── 📂 blog/           # Listagem e páginas dinâmicas do Blog
│       ├── 📂 links/          # LinkFlow (Bio links)
│       └── 📂 trabalho/       # Listagem e estudos de caso dos Projetos
├── svelte.config.js           # Configuração do SvelteKit (Static Adapter)
├── tailwind.config.js         # Configuração legível do Tailwind
└── vite.config.ts             # Configuração do Vite e compilador Tailwind v4
```

---

## 🛠️ Comandos de Desenvolvimento

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado. O gerenciador de pacotes utilizado é o `npm`.

### Instalar dependências:
```bash
npm install
```

### Iniciar servidor de desenvolvimento local:
```bash
npm run dev
```
O servidor estará disponível por padrão em [http://localhost:5173/](http://localhost:5173/).

### Validar tipagens e Svelte check:
```bash
npm run check
```

### Executar testes unitários:
```bash
npm run test
```

### Compilar e prerenderizar para produção (SSG):
```bash
npm run build
```
O resultado final pronto para hospedagem estática será gerado na pasta `build/`.

---

## 🚀 Integração Contínua & Deploy (CD)

Sempre que alterações são integradas ou enviadas (push) para a branch `main`:
1. O workflow `.github/workflows/deploy.yml` é executado no GitHub Actions.
2. Ele instala as dependências, executa a verificação e compila o site usando `npm run build`.
3. Os arquivos estáticos gerados em `build/` são enviados automaticamente para a branch `gh-pages`.
4. O GitHub Pages serve a branch `gh-pages` publicamente no domínio [https://patrickcmserrano.github.io/](https://patrickcmserrano.github.io/).

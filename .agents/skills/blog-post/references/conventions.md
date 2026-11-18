# Convenções e Arquitetura do Blog patrickcmserrano.github.io

Este documento detalha o funcionamento interno do blog, sistema de arquivos, rotas do SvelteKit, catálogo de posts e estúdio de áudio integrado.

---

## 1. Arquitetura de Conteúdo e Rotas

O blog é estático (SSG - Static Site Generation) construído em **SvelteKit 2 + Svelte 5** com o `@sveltejs/adapter-static`.

* **Arquivo de Listagem / Home:**
  * `static/posts.json`: catálogo central e fonte da verdade para o índice e metadados.
  * `src/routes/blog/+page.server.ts`: lê `static/posts.json` no servidor e entrega os posts ordenados por data decrescente.
  * `src/routes/+page.server.ts`: lê `static/posts.json` para exibir os 3 artigos mais recentes na home.
* **Arquivo do Artigo Individual:**
  * Caminho: `static/posts/[slug].[lang].md` (ex: `static/posts/2026-11-18-meu-artigo.pt.md`).
  * Rota do SvelteKit: `src/routes/blog/[slug]/+page.server.ts`.
  * Na compilação (SSG), a função `entries()` lê `static/posts.json` e gera estaticamente cada página `/blog/[slug]/index.html`.

---

## 2. Padrão de Nomenclatura e Slugs

* **Convenção de ID:** `YYYY-MM-DD-<slug-descritivo>`
  * Exemplos reais:
    * `2026-11-18-eval-driven-development-edd-sistemas-ia-producao`
    * `2026-11-04-da-lisp-machine-a-agi-incorporada-craft-agents-voyager-jvm`
    * `2026-10-25-hackeando-runtime-jvm-minecraft-hotpatch-asm`
    * `2026-10-22-ai-factory-privacidade-por-arquitetura`
* **Sufixo de Idioma:**
  * Português: `.pt.md`
  * Inglês: `.en.md`

---

## 3. Estrutura Interna do Arquivo Markdown

```markdown
# Título Principal do Artigo

*Subtítulo ou gancho editorial em itálico resumindo a tese ou o impacto prático do artigo.*

Parágrafo introdutório contextualizando o problema ou narrativa...

---

## 1. Primeira Seção Técnica

Conteúdo detalhado com código, tabelas e links...
```

### Regras do Parser e Layout:
1. **Remoção do H1 Inicial:** O SvelteKit remove automaticamente o primeiro `# Titulo` no backend para evitar duplicação visual com o `<h1>` do cabeçalho da página (definido via `metadata.title` do `posts.json`). Portanto, o H1 deve estar presente no `.md` e ser idêntico ao `title` do `posts.json`.
2. **Divisão em Seções:** O leitor divide o HTML em blocos baseando-se nos cabeçalhos `<h2>`. Cada `<h2>` gera uma seção navegável com ID exclusivo (`sec-...`), que se integra diretamente ao reprodutor de áudio / auto-scroll.
3. **Formatação Matemática:** O parser padrão (Marked) não renderiza delimitadores LaTeX tipo `$k$`. Use formatação em código limpo (ex: ``k``) ou expressões em texto claro.

---

## 4. Estrutura do `static/posts.json`

Cada post no array deve conter:
```json
{
  "id": "2026-11-18-eval-driven-development-edd-sistemas-ia-producao",
  "title": "Eval-Driven Development (EDD): Como Tirar Sistemas de IA do \"Vibe Check\" para a Engenharia de Produção",
  "excerpt": "Resumo denso e direto de 2 a 3 linhas explicando o valor e os temas do artigo.",
  "date": "2026-11-18",
  "readTime": "6 min",
  "tags": [
    "Evals",
    "LLM",
    "Engenharia de Software",
    "RAG",
    "LLM-as-a-Judge",
    "CI/CD"
  ]
}
```

### Tags Comumente Utilizadas:
* `Clojure`, `Go`, `Java 21`, `JVM`, `Python`, `FreeBSD`
* `Arquitetura`, `Engenharia de Software`, `Sistemas`, `DevOps`
* `LLM`, `Evals`, `RAG`, `Agentes Autônomos`, `Embodied AI`
* `Dev Diary`, `Finanças Quantitativas`, `WebGL`, `Three.js`

---

## 5. Estúdio de Gravação e Áudios Narrados

O blog possui um estúdio embutido de narração por seção (`studio=1` ou em `localhost`).
* Os áudios gravados são salvos em: `static/audio/posts/[slug]/`
* O manifesto de seções fica em: `static/audio/posts/[slug]/manifest.json`
* Quando um artigo possui áudio, ele ganha automaticamente a badge `🎧 Narrado` e o player guiado com auto-scroll.

---

## 6. Ciclo de Deploy (CI/CD)

* Ao dar `git push origin main`, o workflow `.github/workflows/deploy.yml` executa:
  1. `npm ci`
  2. `npm run build`
  3. Deploy da pasta `build/` no branch `gh-pages` via `JamesIves/github-pages-deploy-action`.

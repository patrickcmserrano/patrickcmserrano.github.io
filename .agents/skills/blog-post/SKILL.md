---
name: blog-post
description: >-
  Criação, revisão, formatação e publicação de artigos no blog técnico patrickcmserrano.github.io.
  Use esta skill quando o usuário solicitar a criação de um novo post, a adição de um artigo markdown existente,
  a revisão de rascunhos para o blog ou a automação do fluxo de publicação e catálogo em static/posts.json.
---

# Blog Post Workflow — patrickcmserrano.github.io

Esta skill orienta o processo de ponta a ponta para redigir, formatar, catalogar, validar e publicar artigos no blog técnico em SvelteKit do Patrick Campelo Serrano.

---

## 🧭 Visão Geral do Fluxo

```
1. Rascunho / Criação (.md)
       │
       ▼
2. Revisão & Formatação Editorial
   (H1, subtítulo itálico, seções H2, código, sem LaTeX solto)
       │
       ▼
3. Registro Automatizado ou Manual
   (Nomear static/posts/YYYY-MM-DD-<slug>.pt.md e atualizar static/posts.json)
       │
       ▼
4. Validação do Build SSG
   (npm run build -> checar build/blog/<slug>/index.html)
       │
       ▼
5. Git Commit & Push
   (git push origin main -> GitHub Actions CD deploy em gh-pages)
```

---

## 🛠️ Automação Rápida via Helper Script

O repositório conta com um script auxiliar pronto para uso em `.agents/skills/blog-post/scripts/add_post.py`:

```bash
# Execução simples (extrai título, calcula tempo de leitura e data atual):
python3 .agents/skills/blog-post/scripts/add_post.py caminho/do/artigo.md

# Com opções personalizadas e build automático:
python3 .agents/skills/blog-post/scripts/add_post.py caminho/do/artigo.md \
  --slug "meu-artigo-tecnico" \
  --tags "LLM,Arquitetura,Go" \
  --build

# Simulação sem escrita em disco (dry-run):
python3 .agents/skills/blog-post/scripts/add_post.py caminho/do/artigo.md --dry-run
```

O script realiza:
1. Extração do título (`# ...`) e do resumo/subtítulo editorial.
2. Estimativa realista de tempo de leitura (`readTime` a ~200 palavras/min).
3. Normalização do slug com prefixo temporal (`YYYY-MM-DD-<slug>`).
4. Cópia/escrita em `static/posts/<post_id>.pt.md`.
5. Inserção ou atualização atômica no topo de `static/posts.json`.

---

## 📝 Passo a Passo Manual (Caso não use o script)

### 1. Formatar o Conteúdo Markdown

Crie ou ajuste o arquivo seguindo a estrutura padrão:

```markdown
# Título Principal do Artigo

*Subtítulo ou gancho em itálico resumindo a tese central ou o resultado de engenharia.*

Introdução com contexto do mundo real, dores de produção ou desafios técnicos...

---

## 1. Primeira Seção Técnica

Explicação com código, diagramas ou dados...
```

#### Regras Editoriais e Técnicas:
* **H1 Obrigatório:** O primeiro `# Título` deve ser idêntico ao campo `title` de `posts.json`. O SvelteKit o remove no corpo para exibi-lo no cabeçalho estilizado da página.
* **Seções com H2:** Use `##` para títulos de seção principais. O sistema divide o artigo em blocos baseando-se nos `<h2>` para o índice e estúdio de gravação de voz.
* **Sem delimitadores LaTeX soltos:** Use formatação em código ``k`` ou expressões em texto puro (o parser padrão não interpreta `$k$`).
* **Estilo e Tom:** Técnico, direto, baseado em experiências reais de produção e engenharia de sistemas (focado em Clojure, Go, JVM, IA aplicada, bancos bitemporais, finanças quantitativas e arquitetura resiliente).

### 2. Posicionar o Arquivo no Repositório

Salve o arquivo em:
`static/posts/YYYY-MM-DD-<slug>.pt.md`

*(Se houver tradução para inglês, salve também como `YYYY-MM-DD-<slug>.en.md`).*

### 3. Registrar em `static/posts.json`

Abra `static/posts.json` e adicione a entrada no topo do array:

```json
[
  {
    "id": "YYYY-MM-DD-<slug>",
    "title": "Título Exato do Artigo",
    "excerpt": "Resumo atraente de 2 a 3 linhas explicando o conteúdo e a utilidade prática.",
    "date": "YYYY-MM-DD",
    "readTime": "8 min",
    "tags": [
      "Engenharia de Software",
      "Arquitetura",
      "LLM"
    ]
  },
  ...
]
```

### 4. Validar com `npm run build`

Antes de commitar, execute a compilação do SvelteKit para garantir que o `@sveltejs/adapter-static` pré-renderizou a página com sucesso:

```bash
npm run build
```

Verifique se a pasta `build/blog/YYYY-MM-DD-<slug>/index.html` foi gerada e se o artigo aparece em `build/blog/index.html`.

### 5. Commit e Deploy

O deploy em produção é automatizado via GitHub Actions ao fazer push para a branch `main`:

```bash
git add static/posts.json static/posts/YYYY-MM-DD-<slug>.pt.md build/
git commit -m "feat(blog): adicionar artigo sobre <slug>"
git push origin main
```

---

## 📚 Referências Úteis

* Consulte as convenções completas em [references/conventions.md](./references/conventions.md).
* Código-fonte da automação: [scripts/add_post.py](./scripts/add_post.py).

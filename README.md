# LinkFlow

Um aplicativo elegante e responsivo para compartilhar todos os seus links importantes em um só lugar, com design mobile-first, suporte a múltiplos idiomas e player de música integrado.

## Visão Geral

O LinkFlow é uma plataforma de compartilhamento de links que permite organizar e compartilhar seus links importantes de forma categorizada e visual, similar ao LinkTree e outras ferramentas de bio link.

### Recursos Principais

- **Design Mobile-First**: Interface otimizada para dispositivos móveis com experiência de toque aprimorada
- **Categorização de Links**: Links organizados em seções colapsáveis
- **Tema Claro/Escuro**: Suporte a alternância de tema para melhor experiência visual
- **Internacionalização**: Suporte a múltiplos idiomas (português, inglês e espanhol)
- **Compartilhamento Direto**: Links que abrem em novas abas para facilitar o acesso
- **Acessibilidade**: Implementação de práticas de acessibilidade para todos os usuários
- **🎵 Player de Música**: Player fixo integrado com playlist do YouTube Music

## 🎵 Player de Música

O LinkFlow inclui um player de música elegante e minimalista que permite aos usuários ouvir música enquanto navegam pelo site.

### Características do Player:
- **YouTube Embed API oficial**: Utiliza a API oficial do YouTube respeitando direitos autorais
- **Player fixo no topo**: Interface não-intrusiva fixada no topo da tela
- **Controles interativos**: Play/Pause, Next/Previous, Close
- **Visualizador musical animado**: Barras animadas que respondem ao status de reprodução
- **Status em tempo real**: Exibe se está tocando, pausado ou carregando
- **Design responsivo**: Adaptado para desktop e mobile
- **Suporte ao modo escuro**: Integrado com o sistema de temas
- **Multilíngue**: Todas as strings traduzidas para pt/en/es

### Uso do Player:
1. Clique no botão "Playlist Musical" no cabeçalho
2. O player aparecerá fixo no topo da tela
3. Use os controles para navegar pela playlist
4. Clique no X para fechar o player

### Playlist Configurada:
- ID da Playlist: `PL71Q6dgIfRPE1ouM6x8mwsmMX4siQhfrf`
- Fonte: YouTube Music
- Todos os direitos autorais pertencem aos respectivos proprietários

## Estrutura do Projeto

```
📦 LinkFlow
├── 📂 public/
│   └── 📂 images/
│       ├── avatar.svg                # Imagem de perfil do usuário
│       ├── portfolio-icon.svg        # Ícone para links do portfólio
│       ├── weboasis-icon.svg         # Ícone para WebOasis
│       ├── linkedin-icon.svg         # Ícone para LinkedIn
│       ├── github-icon.svg           # Ícone para GitHub
│       └── twitter-icon.svg          # Ícone para Twitter
├── 📂 src/
│   ├── 📂 components/
│   │   ├── LanguageSelector.svelte   # Seletor de idioma
│   │   ├── LinkCard.svelte           # Componente de card para links
│   │   ├── Section.svelte            # Componente de seção colapsável
│   │   └── ThemeToggle.svelte        # Alternador de tema claro/escuro
│   ├── 📂 data/
│   │   └── links.json                # Dados dos links para exibição
│   ├── 📂 lib/
│   │   ├── i18n.ts                   # Sistema de internacionalização
│   │   └── 📂 locales/               # Arquivos de tradução
│   │       ├── en.ts                 # Traduções em inglês
│   │       ├── es.ts                 # Traduções em espanhol
│   │       └── pt.ts                 # Traduções em português
│   ├── App.svelte                    # Componente principal da aplicação
│   └── main.ts                       # Ponto de entrada da aplicação
```

## Componentes Principais

### LinkCard

O componente `LinkCard` exibe um link individual com:
- Ícone à esquerda
- Título centralizado
- Efeito de escala ao passar o mouse/tocar
- Abertura em nova aba
- Tamanho adequado para telas de toque (seguindo diretrizes de acessibilidade)

### Section

O componente `Section` agrupa links relacionados em categorias:
- Cabeçalho com título e indicador de colapso
- Cor de fundo personalizável por seção
- Animação de expansão/colapso
- Estado persistente durante a sessão do usuário

## Configuração de Links

Os links são configurados através do arquivo JSON em `src/data/links.json` que segue a estrutura:

```json
{
  "profile": {
    "name": "Seu Nome",
    "avatar": "/images/avatar.svg"
  },
  "sections": [
    {
      "name": "Projetos",
      "color": "#E0F7FA",
      "links": [
        { "title": "Portfólio", "url": "https://seu-portfolio.com", "icon": "/images/portfolio-icon.svg" },
        // ... mais links
      ]
    },
    // ... mais seções
  ]
}
```

## Testes

O LinkFlow inclui testes unitários e end-to-end (E2E) completos para garantir a qualidade do código.

### Testes Unitários

Utilizamos o [Vitest](https://vitest.dev/) para testes unitários com cobertura para:
- Componente `LinkCard`: renderização correta e comportamento visual
- Componente `Section`: expansão/colapso e renderização de links
- Sistema de internacionalização: mudança de idiomas e traduções
- Alternância de temas: funcionamento correto do tema claro/escuro

### Testes End-to-End (E2E)

Utilizamos o [Playwright](https://playwright.dev/) para testes E2E que verificam:
- Funcionalidade de expansão e colapso das seções de links
- Abertura de links em novas abas
- Acessibilidade de todos os elementos interativos
- Comportamento responsivo em diferentes tamanhos de tela
- Compatibilidade com diferentes navegadores

### Testes de Acessibilidade

Testes específicos para garantir a acessibilidade do aplicativo, verificando:
- Contraste adequado nos elementos visuais
- Navegação por teclado em todos os componentes
- Atributos ARIA apropriados nos elementos interativos
- Tamanho de toque adequado para dispositivos móveis

## Instruções de Uso

### Instalação e Execução

1. Clone o repositório
   ```bash
   git clone [URL-DO-REPOSITÓRIO] LinkFlow
   cd LinkFlow
   ```

2. Instale as dependências
   ```bash
   yarn install
   ```

3. Inicie o servidor de desenvolvimento
   ```bash
   yarn dev
   ```

4. Acesse o aplicativo em `http://localhost:5173/LinkFlow/`

### Personalização

Para personalizar seus links:

1. Edite o arquivo `src/data/links.json` com suas informações
2. Adicione seus ícones personalizados na pasta `public/images/`
3. Ajuste as cores das seções conforme sua preferência no arquivo JSON

## Construção e Implantação

Para gerar uma versão de produção:
```bash
yarn build
```

O resultado será gerado na pasta `dist/` e pode ser hospedado em qualquer servidor web estático.

## Próximos Passos

- **Animações Aprimoradas**: Implementar transições mais suaves entre os estados
- **Temas Personalizados**: Permitir a definição de temas personalizados além do claro/escuro
- **Análise de Cliques**: Adicionar rastreamento de cliques para análise de engajamento
- **Editor Visual**: Interface para edição dos links sem necessidade de editar o JSON

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

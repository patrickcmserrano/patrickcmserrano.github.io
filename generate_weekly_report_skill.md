# 📜 Skill: Gerador de Relatório de Produção e Retrospectiva Semanal

Esta skill instrui um agente de IA a coletar dados reais do workspace do usuário e gerar relatórios de produção semanais estruturados, mapeamento de camadas arquiteturais e histórico de commits do Git.

---

## 🎯 Objetivo
Gerar um relatório técnico de engenharia consolidando as entregas de uma determinada semana (ou semanas anteriores), identificando:
1. Commits feitos nos repositórios locais do desenvolvedor.
2. Integrações de sistema, correções de bugs, DevOps e decisões de arquitetura.
3. Arquivos criados, modificados e lidos.
4. Identificação do uso e despacho de modelos de IA (ex: Claude Fable 5, Sonnet 4.6, Gemini) através de logs de sessões.

---

## 🛠️ Protocolo de Execução (Passo a Passo)

### Passo 1: Descobrir e mapear os repositórios locais
O agente deve listar o diretório `/home/patricks/dev/` (ou caminho equivalente) para encontrar todos os repositórios Git ativos.

### Passo 2: Extrair o histórico Git da semana-alvo
Para cada repositório encontrado, o agente deve rodar o comando:
```bash
git -C "<caminho_do_repositorio>" log --since="<data_inicio>" --until="<data_fim>" --oneline --decorate --graph
```
*Substitua `<data_inicio>` e `<data_fim>` de acordo com a semana desejada (ex: `2026-06-06` a `2026-06-13`).*

### Passo 3: Rastrear arquivos de documentação e diários de bordo
O agente deve procurar e ler diários de bordo, logs ou devlogs locais que forneçam contexto humano sobre o que foi feito na semana:
- `docs/DIARIO_IMPLEMENTACAO.md`
- `docs/DEVLOG.md`
- `DEVLOG.md` / `README.md`

### Passo 4: Rastrear o uso de Modelos de IA (Opcional)
Se o desenvolvedor utiliza a CLI do Claude, as sessões de conversas ficam salvas em JSONL no diretório `~/.claude/projects/`.
1. Fazer um grep por chamadas de modelos nos arquivos `.jsonl`:
   ```bash
   grep -rn '"model":"claude-fable' ~/.claude/projects/
   ```
2. Analisar os JSONL das sessões ativas para coletar:
   - O título da sessão (evento `ai-title`).
   - O prompt inicial do usuário (evento `user`).
   - Ferramentas utilizadas (como `Write`, `Patch`, `Bash`, `Execute`).

---

## 📝 Estrutura do Relatório de Saída

O relatório final deve ser escrito em Markdown (língua portuguesa) com a seguinte estrutura:

```markdown
# Relatório de Produção Semanal — [Projeto/Geral] (Período: DD/MM a DD/MM/AAAA)

Consolidado das atividades de engenharia do desenvolvedor no período.

## 📊 Resumo Executivo das Entregas
[Uma tabela markdown categorizando as entregas por repositório, com colunas de Repositório, Atividade Principal e Escopo Técnico].

## 🏗️ Detalhamento por Projeto e Camadas
[Para cada projeto/repositório, divida em seções com base nas camadas arquiteturais trabalhadas. Exemplos]:
### 1. Projeto: [Nome]
- **Camada Backend ([Tecnologia]):** [O que foi feito, decisões e justificativas].
- **Camada Frontend ([Tecnologia]):** [O que foi feito, layout, bibliotecas].
- **Camada DevOps / Infra ([Tecnologia]):** [Docker, CI/CD, deploys na VPS].

## 📜 Registro Completo de Commits (Histórico Git)
[Lista exata de commits feitos na semana agrupados por repositório]:
### [Repositório]
- `hash` - **[titulo_do_commit]** — [descrição curta das mudanças se aplicável].

## 🤖 Co-Autoria & Sinergia com Inteligência Artificial (AI Symbiosis)
[Se aplicável, detalhe como as IAs foram usadas como co-autoras]:
- **[Modelo IA 1] (Papel/Função):** Tarefas realizadas e arquivos modificados.
- **[Modelo IA 2] (Papel/Função):** Tarefas realizadas e arquivos modificados.
```

---

## 💾 Onde Salvar os Artefatos
O relatório gerado deve ser salvar em formato markdown na pasta correspondente à solicitação do usuário ou no diretório de conversa do agente (`brain/<conversation-id>/`).

# Eval-Driven Development (EDD): Como Tirar Sistemas de IA do "Vibe Check" para a Engenharia de Produção

*Como substituir testes manuais e achismos por suítes determinísticas, LLM-as-a-judge calibrado e gates estatísticos de CI/CD para colocar modelos de linguagem em produção com segurança.*

Na engenharia de software tradicional, ninguém coloca uma alteração crítica em produção após rodar o código manualmente três vezes em `localhost` e achar que "parece bom". Temos testes unitários, contratos de API, testes de integração e pipelines de CI/CD que bloqueiam regressões antes que elas cheguem ao usuário.

Quando o assunto é engenharia de IA aplicada, porém, muitos times ainda operam no modo artesanal: alteram um template de prompt, ajustam o tamanho dos *chunks* de um índice vetorial, testam cinco perguntas no terminal e fazem deploy. O problema desse fluxo — conhecido como *vibe checking* — é que sistemas baseados em LLMs são estocásticos e altamente acoplados. Melhorar a resposta para um caso de borda frequentemente quebra outros dez cenários que funcionavam ontem, de forma silenciosa.

O **Eval-Driven Development (EDD)** resolve esse gargalo trazendo o rigor do TDD para sistemas probabilísticos: antes de otimizar prompts, modelos ou estratégias de busca, você constrói uma suíte versionada de casos de teste e asserções objetivas que governam cada mudança na arquitetura.

---

## 1. Comece pelos seus dados, não por métricas genéricas

Um erro recorrente é importar frameworks prontos de avaliação e confiar em métricas acadêmicas antigas (como BLEU ou ROUGE, que apenas contam sobreposição literal de palavras) ou em notas genéricas de "1 a 5 para utilidade". Em um produto real, uma nota média de `4.2/5` não diz ao engenheiro o que precisa ser consertado.

O ponto de partida de qualquer pipeline sólido de Evals é a **Análise de Erros (*Error Analysis*)**:

1. **Inspecione traces reais:** Extraia de 50 a 100 execuções completas do seu sistema (input do usuário, documentos recuperados, chamadas de ferramentas e saída final).
2. **Categorize as falhas:** Leia os logs e anote onde o sistema quebrou na prática. Você rapidamente verá padrões emergirem: *alucinação de cláusulas não presentes no contexto*, *falha ao buscar siglas ou códigos exatos*, *formatação JSON inválida* ou *recusa indevida de perguntas válidas*.
3. **Transforme falhas em critérios:** Agrupe essas anotações em 5 a 8 modos de falha concretos do seu domínio. É exatamente isso que sua suíte de testes precisa medir.

*(E se o produto ainda não foi para produção? Para resolver o **Cold Start**, use um modelo de fronteira para gerar perguntas sintéticas — incluindo perguntas que exigem cruzar dois documentos distintos e perguntas sem resposta no texto — a partir da sua base de conhecimento, e peça para um especialista humano curar e editar os 30 a 50 melhores casos em uma hora).*

---

## 2. Isole a causa raiz: Retrieval vs. Generation

Em arquiteturas de RAG (*Retrieval-Augmented Generation*) ou agentes com acesso a bases de dados, avaliar apenas a resposta final mascara onde está o gargalo. Se o sistema entregou uma resposta errada, a culpa foi do buscador que não trouxe o trecho certo ou do modelo que ignorou o contexto recebido?

Para responder a isso sem adivinhação, avalie o pipeline em duas etapas independentes:

* **Camada de Retrieval (100% determinística):** Como você mapeou no seu *Golden Dataset* qual `doc_id` ou trecho responde cada pergunta, calcule métricas clássicas de recuperação de informação: **Context Recall** (o documento necessário apareceu entre os *top K* resultados?) e **Context Precision** (os trechos relevantes vieram no topo do ranking ou enterrados no meio de ruído?).
* **Camada de Generation:** Avalie a síntese apenas depois de garantir que o buscador entrega o contexto certo. Aqui os dois pilares são **Faithfulness** (cada afirmação gerada é estritamente suportada pelos trechos recuperados?) e **Answer Relevance** (a resposta resolve diretamente a dúvida do usuário?).

---

## 3. A Pirâmide de Evals em Produção

Avaliar cada caso usando outro LLM é caro e lento. A arquitetura mais eficiente organiza as asserções em três camadas, empurrando o máximo de validação possível para código determinístico:

| Camada | Natureza da Validação | Velocidade e Custo | Exemplos Práticos |
| --- | --- | --- | --- |
| **1. Asserções Determinísticas** | Código puro, regras de negócio, parsers e regex. | Milissegundos / Custo zero | Validação de schema JSON/Pydantic; parser AST de SQL/código gerado; checar se os IDs citados existem nos chunks recuperados; bloqueio *fail-closed* de dados sensíveis (PII). |
| **2. LLM-as-a-Judge Calibrado** | Um modelo avaliador verificando critérios semânticos específicos. | Segundos / Custo moderado | Verificar se a resposta contradiz a política da empresa, se houve omissão de exceções importantes ou se o agente escolheu a ferramenta certa. |
| **3. Sinais Online (Data Flywheel)** | Telemetria e comportamento real dos usuários em produção. | Contínuo | Taxa de aceitação de sugestões, edições manuais feitas pelo usuário antes de salvar, regeneração de resposta e *thumbs down*. |

### Boas práticas para construir um LLM-as-a-Judge confiável

Quando a validação semântica exigir um modelo juiz, evite pedir notas em escalas subjetivas (modelos oscilam arbitrariamente entre dar nota 3 ou 4). Siga quatro regras de engenharia:

1. **Rubricas binárias (`PASS` / `FAIL`):** Crie um avaliador focado em um único modo de falha por vez.
2. **Raciocínio antes do veredito:** Estruture o schema de saída do juiz para que ele escreva a análise (`reasoning`) *antes* de preencher o campo booleano (`passed`), ancorando a decisão nos fatos.
3. **Mitigação de vieses:** Modelos juízes tendem a preferir respostas mais longas (*verbosity bias*), favorecer a primeira opção em comparações pareadas (*position bias*) e dar notas maiores para textos gerados pela mesma família de modelos (*self-enhancement bias*). Use sempre um modelo de família diferente do gerador e inverta a ordem dos pares em testes comparativos.
4. **Calibragem contra humanos:** Rotule manualmente 50 casos e rode o juiz nos mesmos exemplos. Monte uma matriz de confusão e ajuste o prompt do juiz até atingir pelo menos 85–90% de concordância com o julgamento humano.

```python
from pydantic import BaseModel, Field

class FaithfulnessVerdict(BaseModel):
    reasoning: str = Field(
        description="Análise frase por frase comparando a resposta com o contexto."
    )
    is_faithful: bool = Field(
        description="True apenas se TODAS as afirmações estiverem no contexto."
    )

def run_eval_case(case: dict, output: dict, judge_client) -> dict:
    # Camada 1: Falha rápido com asserções determinísticas (custo zero)
    if case["expected_doc_id"] not in output["retrieved_doc_ids"]:
        return {"passed": False, "stage": "retrieval", "reason": "Documento esperado ausente"}

    for cited_id in output["cited_ids"]:
        if cited_id not in output["retrieved_doc_ids"]:
            return {"passed": False, "stage": "deterministic_guard", "reason": f"Citação alucinada: {cited_id}"}

    # Camada 2: Juiz semântico binário com raciocínio prévio
    verdict: FaithfulnessVerdict = judge_client.structured_generate(
        schema=FaithfulnessVerdict,
        prompt=(
            f"Contexto recuperado:\n{output['retrieved_text']}\n\n"
            f"Resposta gerada:\n{output['answer']}\n\n"
            "Verifique se há qualquer dado na resposta que não esteja explicitamente suportado pelo contexto."
        ),
    )

    return {
        "passed": verdict.is_faithful,
        "stage": "llm_judge",
        "reason": verdict.reasoning,
    }
```

---

## 4. Integrando Evals ao CI/CD sem criar "Flaky Tests"

Travar um Pull Request porque um sistema não-determinístico oscilou em um único exemplo frustra o time e faz os engenheiros ignorarem a suíte de testes. Para rodar Evals em esteiras profissionais de integração contínua:

* **Separe as esteiras por velocidade:** Testes determinísticos (Camada 1) rodam de forma síncrona em todo commit e bloqueiam o merge imediatamente se houver falha de contrato, citação inventada ou vazamento de PII. Já os juízes semânticos (Camada 2) rodam antes de releases ou em *builds* noturnos.
* **Use limites estatísticos de regressão:** Em vez de exigir 100% de aprovação absoluta em tarefas abertas, configure o CI para bloquear o deploy apenas se a taxa de `PASS` cair acima de uma margem de tolerância (por exemplo, queda superior a 2% em relação à branch `main`) ou se a latência p95 estourar o SLA.
* **Meça consistência com `pass^k`:** Em agentes que executam ações críticas (como alterações em banco de dados ou disparo de transações), acertar uma vez não basta. Rode o mesmo caso `k` vezes (ex: `k = 3` ou `k = 5`) e exija que todas as execuções passem (`pass^k`), garantindo estabilidade operacional sob variação estocástica.

---

Prompts, hiperparâmetros de busca e definições de ferramentas não são texto solto — são código-fonte que dita o comportamento do sistema em produção. Tratar esses artefatos com versionamento estrito, análise contínua de traces reais e gates automatizados de regressão é o que separa protótipos frágeis de produtos de IA prontos para escalar.

# Privacidade Não é Política, é Arquitetura: Construindo uma Plataforma Privada de IA sobre FreeBSD Jails, vLLM e Slurm

*Série Deep-Dive #1 — Ping Hai & AI Factory*

Quando uma empresa de médio ou grande porte tenta colocar Inteligência Artificial generativa para trabalhar sobre seus próprios documentos — contratos, pareceres jurídicos, prontuários, projetos de engenharia ou propriedade intelectual — ela invariavelmente bate no mesmo muro.

De um lado, a diretoria pressiona por produtividade; quem não adota IA perde margem, e quando a empresa proíbe o uso sem oferecer alternativa, nasce o *Shadow AI*: colaboradores colando segredos industriais em chats públicos na nuvem. Do outro lado, o CISO, o DPO e o Jurídico vetam com razão os copilots e APIs públicas de prateleira: são caixas-pretas fora da jurisdição da empresa, com cobrança variável em dólar e filtros de segurança que costumam operar em modo *fail-open* (quando o filtro falha, o dado vaza).

Nos últimos meses, sob a marca **[Ping Hai](/trabalho/)**, projetei, construí e entreguei em produção a **[AI Factory](/trabalho/ai-factory/)** dentro da infraestrutura de um centro de tecnologia e inovação: uma plataforma privada de IA onde o time conversa com os documentos da própria instituição, em português, sob a identidade que a empresa já possui — **e nada sai de casa**.

A tese que atravessa cada linha de código dessa entrega cabe em uma frase: **em IA corporativa, privacidade não é uma promessa de termos de uso; é o desenho físico e lógico do sistema.**

Neste primeiro artigo da série, abro a arquitetura que sustenta essa plataforma em produção e as decisões de engenharia que tomamos para substituir promessas contratuais por garantias determinísticas de infraestrutura.

---

## 🏛️ A Regra de Ouro: Sistemas Determinísticos em Torno de Modelos Probabilísticos

Um LLM é, por natureza, probabilístico. Tentar resolver controle de acesso, proteção de dados pessoais (LGPD) ou governança de custos escrevendo "por favor, não revele dados confidenciais" no *system prompt* é um erro primário de engenharia.

Para que um comitê de segurança aprove a entrada de IA em produção sobre documentos críticos, toda a fronteira ao redor do modelo precisa ser **determinística e *fail-closed*** (na menor anomalia ou ausência de verificação, o sistema trava fechado em vez de deixar a resposta passar).

Estruturamos a plataforma em quatro pilares arquiteturais verificáveis:

1. **Privacidade por arquitetura e barreiras *fail-closed*** (na ingestão, na busca e na saída).
2. **Frota de inferência própria** (**vLLM** sob **Slurm**) unificada a provedores externos sob governança estrita.
3. **Identidade federada e revogação em tempo real** (**Keycloak SSO** sobre **OpenLDAP**).
4. **Isolamento operacional em nível de SO** (**FreeBSD Jails VNET**, **WireGuard** e ZFS criptografado).

---

## 🔒 Pilar 1: Privacidade por Arquitetura (Antes do Vetor, no RAG e no Egress)

Na maioria das arquiteturas de RAG (*Retrieval-Augmented Generation*), o pipeline pega um PDF, fatia o texto, gera *embeddings* e joga tudo num banco vetorial compartilhado. O problema? Depois que um CPF, um segredo comercial ou um dado sensível vira vetor e texto indexado, o risco de exfiltração por *prompt injection* ou vazamento cruzado entre setores já está contratado.

Na AI Factory, desenhamos três barreiras físicas para o ciclo de vida do dado:

### 1. Sanitização Pré-Vetor e Quarentena Criptografada
Antes de qualquer documento virar vetor no **`pgvector`**, ele passa por um pipeline de inspeção e anonimização via **Microsoft Presidio** calibrado para o contexto brasileiro:
* Dados sensíveis (PII) são identificados e removidos **antes** da geração do embedding.
* Se um documento falha na revisão de conformidade ou apresenta anomalias de extração, ele **nunca chega ao índice**: é desviado imediatamente para uma **quarentena criptografada**, isolada do caminho de busca.
* Para os documentos aprovados, aplicamos **recuperação híbrida em português** (combinando similaridade semântica vetorial + busca lexical BM25 no próprio banco da aplicação, orquestrada em Clojure com **Pathom EQL**), garantindo precisão tanto para conceitos quanto para códigos técnicos, cláusulas e siglas exatas.

### 2. RAG *Owner-Scoped* e *Fail-Closed*
Não basta indexar: o índice precisa respeitar a hierarquia da instituição. A busca documental opera em modo *owner-scoped fail-closed*. Se um colaborador não possui o papel (*role*) exigido para aquela coleção documental, a camada de recuperação nega o acesso com `403 Forbidden` provado por teste automatizado — os blocos daquele documento jamais entram na janela de contexto do modelo.

### 3. Barreira Aduaneira de Saída (*Egress Stamp* Obrigatório)
E se o próprio usuário digitar dados sensíveis no turno do chat ou tentar induzir o modelo a repetir informações críticas?
* Toda resposta gerada pelo modelo precisa atravessar um portão de saída não contornável (`sanitize-output`).
* Esse portão inspeciona a resposta, redige eventuais padrões de PII no turno do assistente e aplica um **carimbo criptográfico interno de saída (*egress stamp*)**.
* **A trava *Stop Chain*:** O *outlet* HTTP do portal exige a presença desse carimbo antes de entregar qualquer byte ao navegador. Se o serviço de sanitização falhar, sofrer timeout ou for contornado por qualquer rota alternativa, a ausência do carimbo faz o *outlet* abortar imediatamente com **`503 Service Unavailable` (*fail-closed*)**. Na dúvida, o dado não sai.

### 4. Administrador Cego ao Conteúdo e Caixa-Preta Imutável
Em muitos sistemas internos, o administrador de TI ou o DBA consegue abrir o painel e ler o que o diretor jurídico ou o CEO estão conversando com a IA. Para eliminar esse vetor de risco interno, separamos radicalmente **telemetria/auditoria** de **conteúdo**:
* **Nem mesmo o administrador lê o conteúdo das conversas pelo produto.**
* A trilha de auditoria registra apenas metadados estruturados — *quem* fez *qual* operação, em *qual* recurso e sob *qual* carimbo de tempo — encadeados por **hash criptográfico com raiz verificável** (`GET /v1/admin/audit/integrity`).
* O resultado é uma caixa-preta de aviação para conformidade (LGPD/ANPD): a instituição prova matematicamente que o log não foi adulterado, sem transformar a equipe de operação em bisbilhoteira de conversas estratégicas.

---

## ⚡ Pilar 2: Frota de Inferência Própria (vLLM sob Slurm) e Curadoria de Risco

Depender exclusivamente de APIs internacionais em dólar cria dois problemas para o CTO e para o CFO: a fatura cresce de forma imprevisível conforme a adoção aumenta, e qualquer instabilidade externa derruba a operação interna.

Por isso, construímos uma **frota própria de inferência** rodando nas GPUs da própria instituição, servida localmente via **vLLM** e orquestrada pelo escalonador de alta performance **Slurm**:

* **Catálogo Único sob Endpoint OpenAI-Compatible:** Para o portal de chat (uma versão fortemente customizada e blindada do Open WebUI), toda a inferência responde atrás de um único endpoint. Atrás dele convivem os modelos locais rodando em GPU própria e, quando permitido pela política da operação, provedores *serverless* externos, com *fallback*, *retry* e *circuit breaker*.
* **Negação de Egress Provada:** Nas rotas soberanas, testes automatizados de perímetro garantem que a inferência toca exclusivamente o *loopback* / malha privada; se um provedor local estiver indisponível, o sistema retorna erro controlado sem fazer *fallback* silencioso para a internet pública.
* **Curadoria de Risco no Seletor de Modelos:** Disponibilizamos dezenas de modelos num único seletor (desde modelos rápidos de baixa latência até modelos densos para raciocínio complexo e código, além de transcrição de áudio local com `whisper-large-v3`). Porém, em uma frota física finita, um modelo de grande porte em paralelismo de tensor (`tp=2`) ocupa nós inteiros de GPU. Para evitar que um usuário comum aloque toda a capacidade do cluster por acidente, aplicamos **curadoria de risco por papel**: modelos pesados ou de alocação exclusiva ficam visíveis e acionáveis apenas para administradores, enquanto o time opera sobre modelos dimensionados para alta concorrência (medidos na nossa baseline com *Time-To-First-Token* de **0,42s–0,43s** e até **507 tokens/s** agregados em `tp=1`).
* **Ciclo de Vida e *Stall Sweep*:** Como modelos grandes levam minutos em *cold-start* ao serem alocados via Slurm, desenhamos um *sweeper* de ciclo de vida que gerencia filas, preserva modelos âncora (como o modelo de resposta do RAG e o motor de STT) contra desligamentos prematuros por ociosidade e mantém *keepalive* nos streams SSE durante a alocação.

---

## 🪪 Pilar 3: Identidade Federada — O Diretório da Empresa Manda

Nada mata mais rápido a adoção — e a segurança — de um sistema corporativo do que criar um cadastro paralelo de usuários. Senhas duplicadas são esquecidas, e quando um colaborador é desligado da empresa na sexta-feira, a conta paralela dele no sistema de IA costuma continuar ativa na segunda.

Na AI Factory, a identidade é **100% federada**:
* O portal autentica via **Keycloak (OIDC)** federando diretamente o diretório **OpenLDAP** que a instituição já opera (com autoridade certificadora PKI interna).
* As contas e permissões são provisionadas por automação no momento do login a partir dos atributos do diretório.
* **Revogação Imediata:** Não existe senha nova nem banco de usuários órfão. Se um colaborador muda de setor ou é desligado no diretório central da empresa, a revogação de acesso às coleções documentais e ao portal é imediata em toda a cadeia, com *single logout* unificado.

---

## 🛡️ Pilar 4: O "Chão" Operacional — FreeBSD Jails, WireGuard e ZFS

Para sustentar esses compromissos de isolamento sem a complexidade inchada de clusters Kubernetes superdimensionados, escolhi uma base operacional clássica, enxuta e auditável: **FreeBSD**.

```
+-------------------------------------------------------------------------+
|                    Host Dedicado FreeBSD + ZFS (AES-256-GCM)            |
|                                                                         |
|  +-------------------+   +-------------------+   +-------------------+  |
|  |   vpn-gateway     |   |  openwebui-jail   |   |  small-pine-jail  |  |
|  |   (WireGuard)     |-->|  (Portal + SSO)   |-->| (RAG + Egress Gate|  |
|  |   VNET Isolada    |   |   VNET Isolada    |   |  + Audit Ledger)  |  |
|  +-------------------+   +-------------------+   +---------+---------+  |
|                                                            |            |
+------------------------------------------------------------|------------+
                                                             | Túnel WG
                                                             v
                                              +---------------------------+
                                              | Frota GPU (Slurm + vLLM)  |
                                              | Nós Dedicados (spark01/02)|
                                              +---------------------------+
```

1. **Jaulas VNET Isoladas:** Cada subsistema — gateway VPN, diretório/SSO, portal web, orquestrador RAG/auditoria e serviços de armazenamento — vive em sua própria **FreeBSD Jail** com pilha de rede virtualizada (`VNET`) e pontes dedicadas, isolando processos, sistema de arquivos e tabelas de roteamento.
2. **Malha Criptografada WireGuard:** A comunicação administrativa, o tráfego entre o host FreeBSD e os nós de GPU (`spark01`/`spark02`) e os túneis de operação trafegam sobre interfaces **WireGuard** com roteamento estrito por par de chaves e *split-DNS*.
3. **Armazenamento ZFS Criptografado:** Os volumes persistentes contam com snapshots e backups **ZFS criptografados em repouso (`AES-256-GCM`)**.
4. **Implantação *One-Command Fail-Closed*:** Todo o provisionamento e configuração são declarativos (OpenTofu + Ansible). O pipeline de deploy em produção roda em 4 fases com *preflight checks* e *smoke tests* automatizados: se qualquer verificação de saúde, federação de identidade ou integridade de banco falhar, o deploy trava antes de expor a versão.

---

## 🧪 Provas Executáveis em Vez de Slides: A Matriz E1–E11

Em engenharia de sistemas críticos, afirmações sem evidência não valem nada. Para que a entrega não dependesse de "confiar na palavra do arquiteto", estruturamos o aceite de produção em torno de **11 entregáveis formais (E1 a E11)** respaldados por uma suíte automatizada de **722 testes (0 falhas)** e **33 provas gravadas em vídeo** executando contra o ambiente real:

| Camada | O Que Foi Provado em Produção | Como é Verificado |
| :--- | :--- | :--- |
| **Identidade & Acesso (E3, E4)** | Login SSO federado, bloqueio de rotas administrativas e revogação imediata de papéis. | Testes E2E de navegador automatizados contra Keycloak + LDAP. |
| **RAG Governado (E5)** | Recuperação *owner-scoped*: usuário sem papel recebe `403` e zero vazamento cruzado entre documentos. | Suíte de regressão E2E + consultas de relevância em português. |
| **Soberania de Inferência (E6)** | Inferência local toca apenas *loopback*/malha interna; zero saída silenciosa para internet pública. | Teste de negação de *egress* (4/4 cenários P0 validados). |
| **Fronteira *Fail-Closed* (E7, E8)** | Redação de PII na saída e bloqueio automático (`503`) caso o *egress stamp* esteja ausente. | Teste de injeção de falha no *outlet* + captura de vídeo da resposta redigida. |
| **Auditoria Imutável (E9)** | Admin sem acesso ao texto do chat e verificação criptográfica da cadeia de hashes de auditoria. | Validação ao vivo no endpoint `GET /v1/admin/audit/integrity`. |
| **Operação & Custos (E10, E11)** | Telemetria de custo real do parque computacional no painel de operações, baseline de throughput e *handover* documentado. | Medições reproduzíveis (`throughput.tsv`) e runbooks completos de operação. |

---

## 🏁 Conclusão: Arquitetura Importa Mais que Escolha de Modelo

Modelos de linguagem mudam a cada trimestre. Um modelo que hoje é o estado da arte será substituído por outro mais rápido e mais barato daqui a seis meses. Quando você constrói uma plataforma onde **o modelo é uma peça plugável atrás de uma infraestrutura determinística**, trocar um modelo de 30B por outro no Slurm leva minutos — mas a governança de identidade, o isolamento das jaulas FreeBSD, a sanitização pré-vetor e a barreira *fail-closed* de saída permanecem intactos.

É isso que transforma IA corporativa de um experimento arriscado em um **ativo tecnológico permanente** dentro da empresa.

---

### 🔜 No Próximo Artigo da Série...

Na **Parte 2** desta série, vamos descer um nível no plano de execução para explorar o **[`small-router`](/trabalho/small-router/)**: como construí em **Go** um gateway de inferência *provider-agnostic* com *circuit breaker*, observabilidade 100% cega ao conteúdo, console desktop nativo em **Wails v2 + Svelte** e por que decidi usar **EDN e schemas Malli (Clojure/Babashka)** para governar seus contratos.

*Se a sua empresa já tentou colocar documentos internos num chat de IA e esbarrou em privacidade, custo de inferência ou integração de identidade, conheça mais sobre o trabalho da **Ping Hai** em [/trabalho/ai-factory/](/trabalho/ai-factory/) ou fale diretamente comigo.*

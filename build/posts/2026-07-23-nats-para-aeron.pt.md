# Troquei um broker de mensagens por um barramento embutido

Em julho eu tirei o NATS JetStream do meu agente e coloquei o Aeron Media Driver rodando dentro do próprio processo. Este post é sobre por que isso fez sentido — e o que eu perdi na troca.

## O problema que ninguém vê: uma porta que colide em silêncio

O sintoma não era "o broker caiu". Era mais chato que isso.

Eu tenho dois projetos que conversam por mensagens. Um deles já usava NATS. O outro — o agente — subiu o NATS dele **na mesma porta padrão**. Dois serviços, uma porta, e nenhum erro na hora de subir: os containers sobem, os logs ficam limpos, e as mensagens vão para o lugar errado. Um barramento de eventos que colide sem avisar é pior que um que cai — porque ele não quebra, ele **mente**.

No meu caso dava para contornar: o agente usava a `4223` para não brigar com a `4222` do outro projeto. E foi assim por um tempo. Mas o comentário no meu próprio arquivo de contexto já dizia o que aquilo era:

> **NATS porta 4222 pertence ao projeto ark-streams** (via SSH tunnel). Este projeto usa **4223**. Nunca mudar para 4222 — vai colidir silenciosamente.

Se a arquitetura depende de uma nota de rodapé para não colidir, a arquitetura não está resolvida. Está adiada.

## O que esse broker me dava — e o que eu realmente usava

O NATS JetStream me dava três coisas: transporte, persistência de stream e um KV. Mas quando eu olhei para o uso real, a conta não fechava:

- **Transporte:** eu usava de verdade.
- **Persistência/replay:** eu tinha o modo durável disponível, mas o fluxo era ao vivo. Um evento que passava, passava.
- **KV:** eu usava — só para estado de conversa e deduplicação.

Ou seja: eu carregava um broker inteiro, um container, uma porta e o modo de falha acima, para obter transporte e um esquema de chave-valor. Duas das três coisas eram pequenas o suficiente para viverem dentro do processo.

## A troca: IPC em vez de rede

O que entrou no lugar foi o **Media Driver do Aeron**, embutido. Em vez de socket e broker, comunicação **IPC** — memória compartilhada na mesma máquina, sem porta, sem container, sem processo externo para subir antes.

A diferença conceitual é grande e vale nomear: eu deixei de ter **um serviço** e passei a ter **uma biblioteca**. O barramento virou parte do processo, não uma peça de infraestrutura que precisa estar viva antes dele.

O que isso resolveu na prática:

- **Zero colisão de porta.** Não existe porta. O problema que originou tudo desapareceu por construção, não por convenção.
- **Menos uma peça para operar.** O `docker-compose` do projeto perdeu um serviço. Deploy mais simples, menos coisa para lembrar.
- **Menos uma dependência de rede** num caminho crítico.

## O preço — e eu não vou fingir que não existiu

Um barramento embutido não é um broker persistente. Isso é a frase mais importante deste post.

**Eu perdi o replay.** O JetStream guardava o histórico do stream; o Media Driver em memória compartilhada não. Assinaturas agora são ao vivo: quem não estava ouvindo, perdeu. Se eu precisasse de persistência de evento de verdade, teria que ligar o **Aeron Archive** — outra peça, outra complexidade, que eu **não** liguei porque não precisei.

**Eu perdi o KV nativo.** O estado de conversa e deduplicação vivia no KV do JetStream. Agora vive num arquivo EDN local, com **gravação atômica** (escreve num temporário e faz `move` atômico) — mesmo resultado, uma peça menos, mas agora é responsabilidade minha garantir que sobreviva a uma escrita interrompida.

E teve um detalhe de compatibilidade que vale registrar: mantive a função `subscribe-durable!` na superfície nova, mas ela agora cria uma assinatura **ao vivo, sem replay**. É um nome antigo fazendo uma coisa menor — deixado ali para não quebrar quem chamava. Documentei isso no código, porque um nome que promete durabilidade e entrega "ao vivo" é uma armadilha para quem ler depois.

## Como decidir isso no seu caso

Se você está pensando em fazer o mesmo movimento, as perguntas que eu usei:

1. **Você precisa de replay de verdade?** Se a resposta é sim — event sourcing, reconstrução de estado, consumidor que pode ficar offline —, um broker persistente é a escolha certa. Não sacrifique isso por simplicidade.
2. **O broker está fazendo mais de uma coisa?** No meu caso, transporte + persistência + KV. Quando só um desses é realmente usado, os outros dois são peso.
3. **Ele é um serviço ou uma biblioteca?** Se ninguém além do seu processo consome o barramento, ele **pode** ser uma biblioteca — e aí metade do problema operacional desaparece.
4. **Qual é o modo de falha hoje?** O meu era colisão silenciosa de porta. Vale mapear: o que quebra sem avisar é sempre o mais caro.

## O que eu aprendi

O ganho não foi performance. Foi **superfície**: menos coisas para subir, menos portas para gerenciar, menos modos de falha escondidos. Trocar um broker por uma biblioteca é abrir mão de capacidades que você não usa para comprar simplicidade que você usa todo dia.

E o custo real foi honesto: eu troquei "durável por padrão" por "ao vivo por padrão". Foi uma decisão consciente, não um efeito colateral. Se eu precisar de replay amanhã, o caminho existe — só não está ligado.

Arquitetura, no fim, é isso: escolher qual complexidade você quer carregar. Eu escolhi carregar a minha no arquivo, não na infraestrutura.

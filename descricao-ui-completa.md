# VibeBud — Especificação completa de UI/UX para implementação

## 1. Objetivo

Implemente a interface do **VibeBud**, um aplicativo de produtividade para desenvolvedores que utilizam IA para programar (*vibe coders*) e para pessoas que começam projetos, mas têm dificuldade em manter a consistência e concluí-los.

A interface deve ser fiel à identidade visual descrita neste documento. Não utilize a imagem de referência como inspiração genérica: use as descrições abaixo como requisitos concretos de implementação.

O VibeBud deve parecer um software de desenvolvimento moderno, com personalidade própria. A experiência precisa transmitir foco, tecnologia, progresso e simplicidade.

A identidade deve combinar:

- Interface dark sofisticada, com superfícies em preto azulado.
- Laranja vibrante para ações importantes, progresso e elementos de destaque.
- Tipografia limpa e legível, com hierarquia visual consistente.
- Um mascote robótico 3D que represente o usuário durante a jornada.
- Componentes discretos, bordas sutis e iluminação laranja usada com moderação.
- Poucos elementos competindo pela atenção em cada tela.

**Regra principal:** a interface deve priorizar a próxima ação do usuário. O usuário precisa abrir o VibeBud e entender imediatamente o que fazer para continuar seu projeto.

---

# 2. Direção visual e identidade

## 2.1. Paleta de cores

Utilize tokens de cores centralizados, evitando valores diferentes para componentes equivalentes.

### Fundos

- `#070B12` — fundo principal da aplicação. Quase preto, com uma leve tonalidade azulada.
- `#0A101A` — fundo de áreas internas e regiões de conteúdo.
- `#0E1622` — superfície padrão de cards.
- `#121D2B` — superfície elevada, menus, campos e cards interativos.
- `#172333` — superfície de hover e seleção secundária.

A interface não deve ser composta por preto absoluto em todos os lugares. A variação sutil entre superfícies cria profundidade e permite distinguir as áreas sem precisar de sombras pesadas.

### Bordas

- `#1B2939` — borda padrão de cards e divisores.
- `#26384C` — borda de elementos interativos em hover.
- `#FF7900` — borda de destaque para elementos selecionados ou focados, quando necessário.

As bordas devem ser finas, normalmente com 1px. Evite contornos claros ao redor de todos os elementos.

### Laranja

- `#FF7900` — laranja principal da marca.
- `#FF8A1F` — laranja secundário para hover e variações de destaque.
- `#FFAB4A` — detalhes luminosos, pequenos indicadores e destaques de progresso.
- `rgba(255, 121, 0, 0.12)` — fundo laranja translúcido para estados selecionados.
- `rgba(255, 121, 0, 0.20)` — glow discreto para o mascote ou elementos importantes.

O laranja deve indicar ação, progresso, atividade ou importância. Não use laranja em todos os textos, ícones e bordas ao mesmo tempo.

### Textos

- `#F3F6FA` — títulos principais e textos de alto contraste.
- `#C1CBD8` — texto secundário e descrições importantes.
- `#8190A3` — legendas, metadados e textos auxiliares.
- `#59687A` — textos desabilitados e informações de menor prioridade.

Evite textos cinza tão escuros que se tornem ilegíveis no fundo.

### Estados

- Verde `#22C58B` para tarefas concluídas e confirmações.
- Azul `#39A8FF` para informações e estados neutros de processamento.
- Vermelho `#F05252` para erros reais e ações destrutivas.
- Amarelo `#F5B942` para alertas e situações que precisam de atenção.

Essas cores devem aparecer apenas quando o estado justificar seu uso.

## 2.2. Tipografia

Utilize **Inter** como fonte principal, caso ainda não exista uma fonte definida no projeto.

Hierarquia sugerida:

- Título de página: 26–30px, peso 600 ou 700.
- Título de seção: 16–19px, peso 600.
- Título de card: 14–16px, peso 500 ou 600.
- Texto principal: 13–14px, peso 400.
- Texto auxiliar: 11–12px, peso 400.
- Botões: 12–14px, peso 500 ou 600.
- Números de progresso e temporizadores: 28–36px, peso 600.

A interface é densa o suficiente para parecer uma ferramenta de produtividade, mas não deve parecer um painel de monitoramento empresarial.

Não use títulos gigantes em todas as telas. Reserve títulos grandes para onboarding, boas-vindas, retomada e conclusão de projeto.

## 2.3. Espaçamento, bordas e dimensões

Use uma escala consistente de espaçamento baseada em múltiplos de 4px.

- 4px: distância mínima entre ícone e detalhe.
- 8px: distância entre elementos relacionados.
- 12px: espaçamento interno compacto.
- 16px: espaçamento padrão entre conteúdos.
- 24px: separação entre seções.
- 32px: separação entre grandes áreas.

Arredondamentos:

- Campos e botões: 7–9px.
- Cards: 10–12px.
- Modais: 12–16px.
- Badges e indicadores pequenos: formato arredondado ou pill.

Evite exagerar no arredondamento. A aparência deve ser tecnológica e precisa, não infantil.

Use sombras discretas apenas quando houver necessidade de destacar uma superfície elevada. O contraste entre os fundos e as bordas deve fazer a maior parte do trabalho visual.

## 2.4. Efeitos e iluminação

O efeito visual característico do VibeBud deve ser a combinação de superfícies escuras e pequenos pontos de iluminação laranja.

Utilize glow suave em:

- Mascote robótico.
- Indicador de progresso ativo.
- Botão primário em hover, de maneira discreta.
- Pequenos elementos que representam evolução ou conquista.

Não aplique glow em todos os cards, botões, textos e ícones. O efeito perde valor quando está presente em toda a interface.

Gradientes podem ser utilizados de forma pontual, principalmente no fundo de uma área de destaque ou atrás do mascote. Evite grandes gradientes coloridos que dominem a tela.

---

# 3. Mascote robótico

## 3.1. Conceito visual

O mascote é um pequeno robô 3D original, com estética tecnológica, acabamento escuro e detalhes luminosos em laranja.

Ele deve parecer um companheiro de desenvolvimento, não um brinquedo infantil.

Características visuais:

- Corpo compacto, com formas geométricas suaves e construção mecânica.
- Carcaça predominantemente preta ou grafite.
- Placas e articulações discretas, com acabamento metálico fosco.
- Olhos luminosos em laranja, expressivos e fáceis de identificar.
- Pequenos detalhes mecânicos, como juntas, painéis e segmentos da armadura.
- Iluminação lateral laranja e reflexos controlados.
- Aparência 3D de alta qualidade, com materiais realistas e volume perceptível.
- Silhueta reconhecível mesmo quando o mascote aparece em tamanho reduzido.

Evite cabeças excessivamente grandes, olhos enormes no estilo desenho infantil, cores pastel, aparência de pelúcia ou roupas de personagem.

O mascote deve manter o mesmo design em todas as telas. Não crie um robô diferente para cada situação.

## 3.2. Expressões e estados

O mesmo modelo visual deve possuir variações de expressão e pose:

- **Neutro:** observando o usuário, olhos acesos e postura relaxada.
- **Trabalhando:** inclinado para a frente, concentrado em uma tarefa.
- **Comemorando:** braços levantados ou pose de vitória, com pequenos detalhes luminosos.
- **Pensativo:** cabeça levemente inclinada, como se estivesse ajudando a refletir sobre um bloqueio.
- **Incentivando:** postura aberta e expressão positiva.
- **Retorno:** pose acolhedora, sem demonstrar tristeza exagerada ou desaprovação.
- **Evolução:** postura mais confiante e detalhes visuais desbloqueados.
- **Conclusão:** pose de celebração com iluminação mais intensa.

As expressões podem ser representadas por imagens específicas ou animações sutis, desde que o resultado mantenha consistência visual.

## 3.3. Regras de utilização

O mascote não deve aparecer com o mesmo tamanho em todas as telas.

- Na home, ele é um elemento secundário de personalidade.
- Na sessão de foco, aparece pequeno, próximo de uma dica.
- Na tela de retorno, pode receber mais destaque.
- Na evolução, aparece ao lado das informações de nível.
- Na conclusão, pode ser o principal elemento visual.

Não deixe o mascote ocupar o espaço necessário para a tarefa principal.

Não gere um mascote com CSS improvisado, emojis ou ícones genéricos se houver uma arte 3D disponível. Se os arquivos de arte ainda não existirem, crie um componente preparado para recebê-los e utilize um placeholder visual temporário e coerente. Não simule uma imagem 3D com um emoji.

---

# 4. Estrutura global da aplicação

## 4.1. Layout desktop

A referência principal é uma janela de 1440 × 900px.

A aplicação deve utilizar um layout de dashboard com três áreas conceituais:

1. Sidebar fixa à esquerda.
2. Área principal de conteúdo.
3. Elementos contextuais dentro do conteúdo, sem uma terceira coluna permanente obrigatória.

A sidebar deve ocupar aproximadamente 68px quando compacta ou entre 190 e 220px quando expandida. Escolha um comportamento e mantenha-o consistente. Na referência visual, a versão expandida possui aproximadamente 80px de largura apenas para a área compacta e cerca de 190px quando os rótulos estão visíveis.

A área principal deve utilizar o espaço restante, com padding entre 24 e 32px.

O conteúdo deve ter largura flexível e não deve ficar espremido no centro de monitores grandes. Evite também esticar cards de maneira desproporcional.

## 4.2. Sidebar

A sidebar deve conter:

- Logotipo do VibeBud na parte superior.
- Navegação principal.
- Perfil do usuário na parte inferior.

O logotipo combina um símbolo laranja simples com o nome “VibeBud” em branco.

Itens de navegação:

- Início.
- Projetos.
- Progresso.
- Configurações.

O item ativo deve ter:

- Fundo sutilmente mais claro que a sidebar.
- Ícone laranja.
- Texto branco.
- Pequeno indicador lateral laranja, caso isso não deixe o visual excessivamente carregado.

Itens inativos utilizam ícones em cinza azulado e textos secundários.

Use uma biblioteca de ícones consistente, como Lucide, se ela já estiver disponível no projeto. Não misture estilos de ícones.

O item “Buddy” pode existir como acesso à evolução do mascote, mas não deve ser necessário duplicar a navegação de progresso. Organize a navegação de acordo com as rotas já existentes no projeto.

Na parte inferior, exiba avatar pequeno, nome e plano ou informação secundária apenas se esses dados realmente existirem. Não invente dados de assinatura.

## 4.3. Cabeçalho das páginas

As telas internas devem possuir um cabeçalho consistente, com:

- Título ou contexto da página.
- Descrição curta, quando necessária.
- Ações contextuais à direita.
- Ícone de notificações, se houver funcionalidade de notificações.
- Avatar do usuário.

Não é necessário repetir um cabeçalho grande em todas as telas. O onboarding e as telas de celebração podem utilizar composições mais livres.

## 4.4. Botões

### Primário

Fundo laranja, texto escuro ou branco com contraste adequado, altura aproximada de 36–42px, cantos discretamente arredondados.

Utilizado para ações como:

- Começar meu projeto.
- Criar projeto.
- Continuar agora.
- Salvar.
- Concluir sessão.
- Continuar meu projeto.

O botão primário deve ser o elemento de ação mais evidente de cada tela.

### Secundário

Fundo escuro, borda discreta e texto claro.

Utilizado para cancelar, voltar, visualizar informações ou executar ações complementares.

### Terciário

Sem fundo aparente, apenas texto e, opcionalmente, um ícone.

Utilizado para ações auxiliares como “Ver progresso” ou “Voltar para o início”.

### Destrutivo

Utilize a cor de erro somente para ações que removam dados ou tenham consequências relevantes. Confirmações devem aparecer quando necessário.

Todos os botões precisam ter estados de hover, foco por teclado, carregamento e desabilitado. Não deixe controles visualmente clicáveis sem uma ação real.

---

# 5. Tela 1 — Boas-vindas

## Objetivo

Apresentar o produto e levar o usuário a criar seu primeiro projeto.

## Composição

Utilize uma tela escura de apresentação, sem excesso de cards.

O logotipo fica no canto superior esquerdo. A área principal é dividida visualmente em duas regiões:

- Texto e CTA à esquerda.
- Mascote robótico 3D à direita.

O fundo é quase preto, com uma iluminação laranja sutil atrás do robô. O efeito deve criar profundidade sem parecer um banner de jogo.

## Conteúdo

Título:

“Vamos tirar esse projeto do papel.”

O trecho “do papel” pode utilizar o laranja principal. O restante do título deve ser branco.

Descrição:

“Um passo de cada vez. Seu próximo projeto merece chegar ao fim.”

Abaixo, um botão primário com o texto:

“Começar meu projeto →”

O botão deve ter tamanho suficiente para ser facilmente identificado, mas não deve parecer um botão de landing page de marketing.

O mascote aparece sentado ou trabalhando diante de um notebook escuro. A pose deve transmitir concentração e disposição para começar.

Pequenos detalhes luminosos podem aparecer ao redor do robô, desde que não distraiam do título e do CTA.

## Comportamento

Ao clicar no CTA, o usuário deve ir para a criação do projeto.

Se já existir um projeto ativo, a tela inicial pode oferecer a opção de continuar esse projeto, em vez de sempre forçar a criação de outro.

---

# 6. Tela 2 — Criação do projeto

## Objetivo

Transformar uma ideia vaga em um projeto com objetivo e critérios de conclusão definidos.

## Composição

Use uma tela interna padrão, com sidebar à esquerda e formulário na área principal.

O formulário deve ter uma largura controlada, aproximadamente entre 600 e 800px. Não estique os campos por toda a tela.

No topo, exiba:

Título: “Vamos criar seu projeto!”

Descrição: “Defina o que você quer construir e como saberá que está pronto.”

No canto superior direito, disponibilize “Cancelar” e o botão primário “Próximo →”.

## Campos

### Nome do projeto

Campo de texto com placeholder:

“Ex.: Meu app de tarefas”

Deve ser o campo mais evidente do formulário.

### O que você quer construir?

Campo de texto maior, permitindo explicar a ideia em poucas frases.

Placeholder:

“Ex.: Uma aplicação web para organizar tarefas do dia a dia.”

### Qual é o objetivo?

Campo de texto para descrever o resultado que o usuário deseja alcançar.

Placeholder:

“Ex.: Ajudar pessoas a organizar suas tarefas em um único lugar.”

### Critérios de conclusão

Uma área que permite adicionar itens verificáveis, como:

- Funcionalidades principais implementadas.
- Projeto publicado.
- Documentação criada.

Cada item deve ser apresentado com uma checkbox, texto e opção de remover.

Esses itens são exemplos visuais. Os critérios reais devem ser editáveis pelo usuário.

### Prazo opcional

Se o sistema já oferecer prazo, exiba um seletor de data com o rótulo “Prazo (opcional)”.

Não obrigue o usuário a definir uma data para começar.

## Botão final

“Criar projeto”

O botão deve ocupar a largura do formulário ou ficar alinhado à direita, conforme a composição escolhida. Mantenha o mesmo padrão em todo o produto.

## Comportamento

- Validar os campos obrigatórios.
- Exibir mensagens de validação próximas dos respectivos campos.
- Permitir adicionar e remover critérios.
- Salvar o projeto antes de avançar.
- Exibir feedback de carregamento ao salvar.
- Em caso de falha, preservar os dados preenchidos.

Não avance para a tela seguinte apenas porque o botão foi clicado. A criação precisa ser concluída com sucesso.

---

# 7. Tela 3 — Planejamento do projeto

## Objetivo

Transformar o projeto em etapas menores e compreensíveis.

## Composição

Título: “Planejamento do projeto”

Descrição: “Organize suas etapas e tarefas. Você pode editar a qualquer momento.”

No centro da tela, apresente um card principal com o resumo do projeto:

- Ícone do projeto.
- Nome do projeto.
- Descrição curta.
- Quantidade de etapas concluídas e totais.
- Barra de progresso.

Abaixo, apresente a lista de etapas.

## Lista de etapas

Cada etapa deve ser uma linha ou card compacto, contendo:

- Número da etapa em um círculo.
- Nome da etapa.
- Quantidade de tarefas.
- Indicador de conclusão.
- Ícone para expandir ou recolher.

Exemplos de etapas:

1. Configuração do ambiente.
2. Estrutura da aplicação.
3. Desenvolvimento do frontend.
4. Integração com API.
5. Testes e ajustes.
6. Publicação.

Os nomes são exemplos, não uma estrutura obrigatória para todos os projetos.

Quando uma etapa for expandida, devem aparecer as tarefas associadas, com checkboxes e opções de edição.

Uma etapa concluída deve apresentar um indicador visual discreto, preferencialmente verde ou neutro, sem transformar a lista em uma sequência de cores fortes.

## Ações

- Adicionar etapa.
- Editar nome da etapa.
- Adicionar tarefa.
- Editar tarefa.
- Reordenar etapas e tarefas, se suportado.
- Marcar tarefa como concluída.
- Continuar para o projeto.

O botão principal deve ser “Salvar planejamento” ou “Continuar para o projeto”, dependendo do fluxo real.

Não torne o planejamento um processo excessivamente longo. O objetivo é reduzir a barreira para começar, não exigir um planejamento perfeito antes de programar.

---

# 8. Tela 4 — Home principal

Esta é a tela mais importante do aplicativo. Ela deve ser especialmente bem executada.

## Objetivo

Fazer o usuário abrir o VibeBud e identificar imediatamente qual é o próximo passo.

## Cabeçalho

Título personalizado:

“Olá, Matheus!”

A saudação deve utilizar o nome real do usuário quando disponível. Não deixe o nome de exemplo fixo no código.

Abaixo:

“Que bom ter você de volta. Vamos continuar?”

O cabeçalho deve ocupar pouco espaço vertical.

## Card de próxima ação

Este é o componente de maior prioridade visual da home.

Ele deve ficar na região superior esquerda do conteúdo principal, com tamanho suficiente para destacar a tarefa.

Conteúdo:

- Rótulo pequeno: “Próxima ação”.
- Nome do projeto ativo.
- Nome da tarefa que precisa ser realizada.
- Etapa à qual ela pertence.
- Estimativa de tempo, se existir.
- Botão primário “Começar agora →”.

Exemplo:

Projeto: Meu app de tarefas.

Tarefa: Implementar formulário de cadastro.

Etapa 2 · Frontend.

O card deve usar uma superfície ligeiramente mais clara que o fundo, borda discreta e um pequeno detalhe laranja.

A tarefa deve ser o texto mais importante do card. Não esconda a ação principal em um menu.

Se não houver uma próxima tarefa definida, mostre um estado vazio com CTA para planejar o projeto ou escolher a próxima tarefa.

## Área do mascote

À direita do card ou na região superior direita da home, exiba o robô em tamanho médio.

O mascote pode aparecer próximo de uma frase curta, como:

“Vamos codar?”

Não crie uma grande área de chat. O mascote é um elemento de apoio, não o protagonista da tela.

## Sequência de desenvolvimento

Abaixo da próxima ação, exiba um componente horizontal de consistência.

Título: “Sequência de desenvolvimento”

Apresente os últimos sete dias como pequenos círculos ou células, identificando visualmente os dias em que houve uma sessão de desenvolvimento registrada.

O dia atual deve ser destacado.

O indicador deve representar atividade real registrada no VibeBud, conforme as regras de negócio. Não afirme que o usuário programou no computador se o aplicativo não consegue verificar isso.

Ao lado ou abaixo, exiba a sequência atual, por exemplo:

“5 dias”

Utilize o laranja para destacar o número.

Não penalize visualmente o usuário por dias sem atividade.

## Progresso do projeto

Exiba um card compacto com:

- Percentual concluído.
- Barra de progresso.
- Quantidade de tarefas concluídas e totais.

Exemplo visual: “42% concluído”.

O percentual deve vir dos dados reais do projeto, e não ser um valor fixo.

## Hierarquia

A ordem de atenção deve ser:

1. Próxima tarefa.
2. Botão para começar.
3. Progresso do projeto.
4. Sequência de desenvolvimento.
5. Mascote e mensagens de apoio.

Evite adicionar dezenas de estatísticas, gráficos, conquistas e cartões à home. Ela não deve virar um dashboard empresarial.

---

# 9. Tela 5 — Sessão de foco

## Objetivo

Ajudar o usuário a trabalhar em uma tarefa específica sem distrações.

## Composição

Mantenha a sidebar, mas reduza o ruído visual da área de trabalho.

Título: “Hora de focar!”

Descrição: “Sem distrações, só você e seu projeto.”

O conteúdo deve ser dividido em dois cards principais.

### Card principal — Tarefa atual

Exiba:

- Nome do projeto.
- Etapa atual.
- Nome da tarefa.
- Descrição ou critérios da tarefa, quando disponíveis.
- Temporizador.
- Controles de sessão.

O temporizador deve ser o elemento visual mais importante depois do nome da tarefa.

Use números grandes, entre 30 e 36px, e uma tipografia adequada para leitura de números.

Exemplo: `24:32`.

O temporizador pode ter um anel circular de progresso laranja ao redor, mas não deve ocupar a maior parte da tela.

Controles:

- Iniciar.
- Pausar.
- Retomar.
- Encerrar sessão.

Se o temporizador for opcional, ofereça a possibilidade de trabalhar sem ele. O usuário não deve ser obrigado a usar a técnica Pomodoro.

### Card secundário — Bloqueios

Título: “Se estiver travado…”

Descrição: “Registre o que está impedindo você de avançar.”

Campo de texto com placeholder:

“O que está te impedindo?”

Botão secundário: “Registrar bloqueio”.

Ao registrar um bloqueio, o usuário deve poder continuar a sessão ou ir para o fluxo de resolução de bloqueios.

### Dica do Buddy

Na parte inferior, exiba uma pequena área de dica com o robô em miniatura.

Exemplo:

“Você consegue! Um pequeno progresso já conta.”

As mensagens devem ser curtas, variadas e não excessivamente motivacionais.

## Comportamento do temporizador

- Deve iniciar e parar corretamente.
- A pausa não deve apagar o tempo já acumulado.
- O encerramento deve registrar a duração real da sessão.
- A interface deve refletir imediatamente os estados de execução.
- Se a página for recarregada, o estado da sessão deve ser recuperado quando a implementação permitir.
- O tempo deve ser calculado de forma confiável, não apenas subtraindo um segundo a cada intervalo sem considerar atrasos.

---

# 10. Tela 6 — Encerramento da sessão

## Objetivo

Fazer o usuário reconhecer o progresso realizado e registrar o resultado da sessão.

## Composição

Esta tela deve ter menos elementos que a home.

O fundo permanece escuro, mas pode apresentar uma iluminação laranja um pouco mais intensa na região central.

O mascote aparece centralizado ou ligeiramente acima do título, em pose de comemoração.

Título:

“Boa! Sessão concluída!”

Descrição:

“Você avançou mais um pouco no seu projeto.”

Abaixo, apresente três informações resumidas em pequenos cards:

- Tarefa trabalhada.
- Tempo de foco.
- Progresso atualizado.

Exemplo:

Tarefa: Implementar formulário de cadastro.

Tempo de foco: 25 minutos.

Progresso do projeto: 42%.

Os números são ilustrativos e devem ser substituídos pelos valores reais.

## Registro do resultado

Ofereça um campo opcional:

“O que você conseguiu avançar?”

E uma opção simples para indicar se a tarefa foi concluída, continua em andamento ou foi parcialmente realizada.

Não marque automaticamente uma tarefa como concluída apenas porque a sessão acabou.

## CTA

Botão primário:

“Ver próxima tarefa →”

Ação secundária:

“Voltar para o início”

O fluxo deve terminar com uma direção clara para continuar o trabalho, sem obrigar o usuário a iniciar outra sessão imediatamente.

---

# 11. Tela 7 — Registro de bloqueios

## Objetivo

Ajudar o usuário a identificar o que está impedindo o avanço e transformar o bloqueio em uma ação concreta.

## Composição

Título:

“O que está te impedindo?”

Descrição:

“Seja específico. Isso ajuda a encontrar o próximo passo.”

A tela deve ter um formulário principal à esquerda e uma área de dicas à direita.

## Formulário

### Tipo de bloqueio

Utilize opções selecionáveis, apresentadas como pequenas caixas ou chips:

- Técnico.
- Documentação.
- Dúvida.
- Distração.
- Outro.

O item selecionado recebe borda ou fundo laranja translúcido.

### Descrição do bloqueio

Campo de texto maior:

“Ex.: Erro na requisição da API.”

### O que você já tentou?

Campo opcional:

“Ex.: Verifiquei o token e as permissões.”

### Próximo passo

Campo:

“Qual será sua próxima ação?”

Exemplo:

“Verificar a resposta da API e identificar o código de erro.”

Este campo é importante porque o bloqueio deve terminar com uma ação possível, mesmo que pequena.

## Área de dicas

Título: “Dicas rápidas”

Apresente sugestões curtas que mudem conforme o tipo de bloqueio, quando houver lógica para isso.

Exemplos:

- Divida a tarefa em partes menores.
- Verifique a mensagem de erro.
- Consulte a documentação.
- Registre a dúvida para resolver depois.

Não implemente uma inteligência artificial fictícia. Caso não exista integração de IA, as sugestões devem ser regras estáticas claramente definidas.

## CTA

Botão primário:

“Salvar e continuar”

Ação secundária:

“Cancelar”

Após salvar, mostre uma confirmação discreta e ofereça o retorno à sessão ou à home.

---

# 12. Tela 8 — Progresso

## Objetivo

Mostrar a evolução do usuário e do projeto de maneira clara, sem transformar consistência em competição.

## Cabeçalho

Título: “Seu progresso”

Descrição:

“Cada passo conta. Continue assim.”

## Indicadores principais

No topo, exiba três cards compactos:

### Sequência atual

Número de dias consecutivos com atividade registrada.

Exemplo: 5 dias.

### Melhor sequência

Recorde pessoal.

Exemplo: 12 dias.

### Progresso do projeto

Percentual concluído, calculado a partir das tarefas.

Os dados devem vir do histórico real do usuário.

## Calendário de atividade

Um card com calendário mensal, usando a grade convencional de sete colunas.

Cada dia deve mostrar se houve uma sessão registrada.

Use uma intensidade discreta para representar atividade, sem depender exclusivamente da cor para comunicar o estado.

O calendário deve permitir navegar entre meses, se o histórico estiver disponível.

Não exiba registros inventados ou dias de programação que o sistema não tenha observado.

## Etapas concluídas

Ao lado do calendário, exiba uma lista compacta de etapas ou conquistas concluídas.

Cada item pode conter:

- Ícone.
- Nome.
- Data de conclusão, quando disponível.
- Indicador de estado.

## Conquistas

Apresente conquistas pessoais, por exemplo:

- Primeira sessão.
- Primeira sequência de dias.
- Primeira etapa concluída.
- Projeto publicado.

As conquistas devem ser desbloqueadas por condições reais. Não mostre medalhas bloqueadas em excesso nem transforme a tela em um jogo competitivo.

---

# 13. Tela 9 — Evolução do Buddy

## Objetivo

Permitir que o usuário acompanhe o desenvolvimento visual do mascote e personalize alguns elementos.

## Composição

Título:

“Seu Buddy”

Descrição:

“Ele está evoluindo junto com você!”

A área principal deve ser dividida em duas partes.

### Card do nível

À esquerda, exiba o mascote em tamanho maior.

Abaixo ou ao lado:

- Nível atual.
- Experiência acumulada.
- Barra de progresso até o próximo nível.
- Próximo marco de evolução, quando aplicável.

Exemplo visual:

Nível 2.

320 / 1.000 XP.

O sistema não deve conceder experiência aleatória. A pontuação deve seguir regras definidas no produto, vinculadas a atividades reais.

### Personalização

À direita, exiba opções de personalização em pequenos cards:

- Expressões.
- Acessórios.
- Variações de iluminação.
- Detalhes visuais desbloqueados.

Os itens devem apresentar claramente seu estado:

- Disponível.
- Selecionado.
- Bloqueado.

Os itens bloqueados podem exibir a condição necessária para desbloqueio.

Não invente uma loja, moedas virtuais ou pagamentos dentro do produto se essas funcionalidades não estiverem previstas.

## Feedback

Quando houver evolução de nível, apresente uma animação curta e um estado de celebração.

Não reproduza animações longas toda vez que o usuário abrir a tela.

---

# 14. Tela 10 — Retorno após uma pausa

## Objetivo

Facilitar a retomada de um projeto após um período de inatividade.

Esta é uma das telas mais importantes para a proposta do VibeBud.

## Composição

A tela deve ter um layout mais simples e acolhedor que o dashboard normal.

O mascote aparece à esquerda ou no centro, com iluminação suave. A área de texto deve ter bastante espaço vazio.

Título:

“Bom ter você de volta!”

Descrição:

“Vamos retomar de onde parou?”

A mensagem não deve sugerir que o usuário falhou, desperdiçou tempo ou decepcionou o mascote.

## Card de retomada

Exiba um card com:

- Nome do projeto ativo.
- Última tarefa trabalhada.
- Última atividade registrada, se disponível.
- Próxima ação recomendada.
- Progresso atual.

Exemplo:

Projeto: Meu app de tarefas.

Última tarefa: Implementar formulário de cadastro.

Próximo passo: Validar os campos do formulário.

Os dados precisam refletir o histórico real do usuário.

## CTA

Botão primário:

“Continuar meu projeto →”

Ação secundária:

“Ver resumo completo”

O botão principal deve levar diretamente à próxima ação possível, sem obrigar o usuário a passar por um tutorial ou refazer o planejamento.

## Estado sem projeto anterior

Se não houver projeto ativo, exiba uma mensagem equivalente, mas com um CTA para começar um novo projeto.

---

# 15. Tela 11 — Conclusão do projeto

## Objetivo

Celebrar a conclusão e encerrar o ciclo do projeto.

## Composição

Esta é uma tela especial, visualmente mais marcante que as telas internas.

O fundo continua dark, com uma iluminação laranja concentrada na região central.

O mascote aparece em pose de comemoração, acompanhado de pequenos elementos luminosos. Evite confetes excessivos ou uma estética infantil.

Título:

“Você tirou a ideia do papel!”

Descrição:

“Parabéns por concluir seu projeto. Agora ele está pronto para o próximo passo.”

## Resumo

Apresente um card com:

- Nome do projeto.
- Data de conclusão.
- Quantidade de tarefas concluídas.
- Etapas concluídas.
- Link do projeto publicado, se informado pelo usuário.

Exiba apenas informações realmente disponíveis.

## Ações

Botão primário:

“Ver projeto”

Ações secundárias:

- “Arquivar projeto”.
- “Começar um novo projeto”.

Se o usuário não publicou o projeto, não afirme que ele está publicado. A conclusão do projeto e a publicação devem ser estados distintos.

Ao iniciar um novo projeto, mantenha o histórico do anterior.

---

# 16. Tela 12 — Configurações

## Objetivo

Permitir que o usuário personalize lembretes e preferências sem uma tela excessivamente complexa.

## Composição

Título: “Configurações”

Descrição:

“Personalize sua experiência e defina suas preferências.”

Use seções verticais, com títulos pequenos, divisores sutis e controles alinhados.

### Lembretes

Opção: “Receber lembretes”.

Use um toggle com estados ativo e inativo.

Quando ativo, exiba as opções relacionadas, como horário e frequência, de acordo com as funcionalidades existentes.

### Horário

Campo para escolher o horário de lembrete.

Exemplo visual: 09:00.

Não prometa notificações em horários específicos se o sistema de notificações ainda não estiver implementado.

### Sequência

Se houver regras configuráveis de descanso, apresente-as aqui. Não crie opções que alterem silenciosamente o cálculo histórico das sequências.

### Preferências visuais

Opções como animações reduzidas ou preferências de notificações podem ser apresentadas se realmente forem suportadas.

Como a identidade principal do VibeBud é dark, não adicione um seletor de tema claro sem que isso faça parte do escopo.

### Acessibilidade

Respeite navegação por teclado, foco visível e preferência de movimento reduzido quando houver animações.

---

# 17. Componentes reutilizáveis

Implemente a interface utilizando componentes compartilhados, em vez de criar cada tela isoladamente.

Os componentes devem seguir o design system e receber dados por propriedades, evitando textos e números fixos dentro da lógica visual.

Componentes sugeridos:

- `AppLayout` — estrutura geral.
- `Sidebar` — navegação lateral.
- `PageHeader` — título e ações da página.
- `PrimaryButton` — botão principal.
- `SecondaryButton` — botão secundário.
- `IconButton` — botão de ícone.
- `Card` — superfície padrão.
- `ProjectCard` — resumo de projeto.
- `NextActionCard` — próxima tarefa em destaque.
- `ProgressBar` — progresso horizontal.
- `ProgressRing` — progresso circular.
- `StreakIndicator` — sequência de desenvolvimento.
- `ActivityCalendar` — calendário de atividade.
- `TaskItem` — tarefa individual.
- `StageAccordion` — etapa expansível.
- `TextField` — campo de texto.
- `Textarea` — campo de texto multilinha.
- `Checkbox` — seleção de conclusão.
- `Toggle` — preferências booleanas.
- `Modal` — diálogos.
- `Toast` — mensagens temporárias.
- `EmptyState` — estado sem conteúdo.
- `LoadingState` — carregamento.
- `BuddyCharacter` — mascote e suas expressões.
- `SessionTimer` — temporizador.
- `AchievementCard` — conquista.

A lista é uma sugestão de arquitetura. Reutilize componentes existentes quando eles já atenderem aos requisitos.

Não crie abstrações excessivas para componentes que só precisam existir uma vez. A prioridade é manter consistência e facilitar a manutenção.

---

# 18. Estados e interações

Toda tela deve contemplar os estados relevantes, não apenas a aparência ideal apresentada na imagem.

## Estados obrigatórios

- Normal.
- Hover.
- Foco por teclado.
- Selecionado.
- Desabilitado.
- Carregando.
- Sucesso.
- Erro.
- Vazio.

## Feedback

Ao salvar uma informação, exiba feedback claro.

Exemplos:

- “Projeto criado.”
- “Planejamento salvo.”
- “Bloqueio registrado.”
- “Preferências atualizadas.”

Mensagens de erro devem explicar o que aconteceu e, quando possível, como corrigir.

Não use alertas nativos do navegador para todas as interações. Prefira componentes visuais consistentes com a aplicação.

Confirme ações destrutivas quando houver risco de perda de dados.

---

# 19. Responsividade

A referência principal é desktop, mas a interface precisa funcionar em janelas menores.

## Desktop — a partir de 1200px

- Sidebar expandida ou no tamanho definido para desktop.
- Cards organizados em colunas quando fizer sentido.
- Próxima ação em destaque.
- Mascote visível sem comprometer o espaço de trabalho.

## Tablet — aproximadamente 768px a 1199px

- Reduzir padding.
- Ajustar grades.
- Permitir sidebar compacta.
- Reorganizar cards em duas colunas ou uma coluna, conforme a largura real.

## Mobile — abaixo de 768px

- Substituir a sidebar fixa por navegação compacta ou menu.
- Empilhar cards verticalmente.
- Evitar temporizadores cortados.
- Fazer formulários ocuparem a largura disponível.
- Manter o CTA principal facilmente acessível.
- Reduzir o tamanho do mascote quando necessário.
- Evitar rolagem horizontal da página.

A responsividade não deve ser feita simplesmente diminuindo tudo. Os componentes precisam se reorganizar para continuar utilizáveis.

---

# 20. Microinterações e animações

As animações devem ser curtas e funcionais.

Sugestões:

- Transição de 150–220ms em hover.
- Pequena animação na conclusão de uma tarefa.
- Preenchimento animado da barra de progresso.
- Movimento sutil do mascote em telas de destaque.
- Animação breve ao desbloquear uma conquista.
- Feedback visual no início e no encerramento de uma sessão.

Evite:

- Mascote se movimentando constantemente enquanto o usuário tenta trabalhar.
- Partículas permanentes no fundo.
- Grandes animações entre todas as páginas.
- Efeitos que atrasem o acesso à tarefa.
- Animações obrigatórias que não respeitem a preferência por movimento reduzido.

A interface deve permanecer rápida e silenciosa durante o trabalho.

---

# 21. Regras de consistência visual

A implementação precisa respeitar estas regras em todas as telas:

1. O fundo principal permanece preto azulado.
2. O laranja é reservado para ações e destaques importantes.
3. Os cards possuem bordas sutis e superfícies diferenciadas.
4. O mascote mantém o mesmo design, materiais e proporções.
5. Títulos, descrições e botões seguem uma hierarquia tipográfica consistente.
6. O espaçamento segue uma escala definida.
7. Ícones pertencem à mesma família visual.
8. O botão principal de cada tela é fácil de identificar.
9. O usuário nunca precisa procurar a próxima ação.
10. Telas especiais podem ter mais personalidade, mas não devem parecer produtos diferentes.
11. O progresso exibido precisa corresponder aos dados reais.
12. Não exiba elementos decorativos que pareçam controles funcionais.
13. Não crie números, estatísticas ou conquistas fictícias para preencher espaço.
14. Não adicione novos recursos de produto apenas para tornar a interface visualmente mais rica.

---

# 22. Diretrizes para implementação

Antes de modificar o projeto:

1. Analise a estrutura atual, as tecnologias utilizadas e os componentes já existentes.
2. Identifique as rotas e os fluxos funcionais implementados.
3. Reutilize a arquitetura e as dependências atuais sempre que possível.
4. Não substitua o backend nem altere regras de negócio apenas para facilitar a implementação visual.
5. Separe estilos, componentes e páginas de maneira organizada.
6. Centralize tokens de cor, tipografia, espaçamento, bordas e estados.
7. Mantenha a interface conectada aos dados reais já disponíveis.
8. Implemente estados de carregamento, erro e ausência de dados.
9. Preserve as funcionalidades que já funcionam.
10. Não coloque toda a interface em um único componente enorme.

Se o projeto ainda não possuir todas as funcionalidades necessárias, implemente primeiro as telas que correspondem aos fluxos existentes e identifique claramente o que depende de backend ou de funcionalidades futuras.

Não simule persistência usando apenas estados locais se a funcionalidade exige salvar dados de forma permanente.

Não adicione bibliotecas sem necessidade. Se o projeto já tiver uma solução para ícones, animações, componentes ou roteamento, priorize essa solução.

Se houver dúvidas sobre a estrutura atual, examine o código antes de tomar decisões arquiteturais.

---

# 23. Critérios de aceitação visual

A interface será considerada alinhada à especificação quando:

- A home mostrar claramente a próxima tarefa.
- O tema dark estiver presente em todas as telas internas.
- A paleta preto azulado e laranja estiver consistente.
- O mascote parecer um robô 3D tecnológico, e não um personagem infantil.
- As 12 telas descritas estiverem representadas quando seus fluxos fizerem parte do escopo.
- Os componentes compartilhados mantiverem a mesma aparência e comportamento.
- Formulários, botões, toggles, temporizador e navegação funcionarem.
- O layout se adaptar a diferentes larguras.
- Os estados vazios, carregamentos e erros forem tratados.
- Não existirem dados fictícios apresentados como dados reais.
- As telas continuarem utilizáveis sem depender de animações.
- O resultado final parecer um produto único e coerente, não uma coleção de templates diferentes.

**Prioridade final:** fidelidade visual, clareza e consistência. Não acrescente elementos só porque parecem tecnológicos. O VibeBud deve ter personalidade, mas cada detalhe visual precisa reforçar a experiência de ajudar o usuário a continuar e concluir seu projeto.

Implemente a interface progressivamente, validando a aparência no navegador em uma resolução de 1440 × 900px e corrigindo diferenças visuais antes de considerar o trabalho concluído.
# VibeBud — plano de produto

Revisão consolidada em 28 de outubro de 2026, após definição conjunta do escopo.

## 1. Proposta e público

O VibeBud é um companheiro que gamifica o desenvolvimento de projetos com IA para incentivar constância. Ele mantém o projeto presente e incentiva o usuário a voltar quando esquecer, procrastinar, desanimar ou deixar o trabalho parado.

O público inicial são pessoas que já começaram uma aplicação com IA e a deixaram parada ou travaram antes de publicar.

Trabalhar no projeto já vale, mesmo sem concluir uma tarefa ou resolver um erro. O produto não cobra desempenho, velocidade, quantidade entregue ou qualidade do código. Planejamento e tarefas apoiam a experiência; o centro é a combinação de Bud, histórico visual, sequência e lembretes.

## 2. Beta e validação

Lançar uma beta gratuita para um grupo pequeno. Assinaturas e cobrança ficam para depois de observar o uso.

A hipótese principal é que a experiência incentiva as pessoas a retornar ao mesmo projeto ao longo das semanas. Observar esse retorno e ouvir os usuários sobre o papel do Bud, do histórico e dos lembretes.

Quantidade de commits e entregas não são metas de desempenho. Um registro de atividade não prova, sozinho, que o VibeBud causou o retorno.

## 3. Conta e dados

- Exigir uma conta para usar o produto.
- Salvar projetos, tarefas, Buds, atividade, histórico e preferências na nuvem.
- Permitir recuperar os dados ao trocar de navegador ou computador.
- Oferecer a conexão GitHub depois do login, como etapa opcional.
- Permitir exportar e excluir dados.
- Não apresentar dados fictícios ou operações ainda não salvas como persistidos.

A escolha do provedor de autenticação e dos serviços de infraestrutura fica para a implementação, respeitando esses requisitos.

## 4. Cadastro e tarefas

O cadastro deve ser curto e obter descrição e objetivo suficientes para identificar o projeto e gerar sugestões.

- Usar IA para sugerir tarefas iniciais a partir da descrição e do objetivo.
- Permitir editar, adicionar, remover ou dispensar tarefas.
- Não condicionar a constância à conclusão dessas tarefas.
- Se o usuário ficar sem tarefas, explicar que perde esse apoio de organização e uma das fontes de registro de atividade.
- Não bloquear o uso por falha da geração: permitir seguir com tarefas manuais ou sem tarefas.
- Evitar onboarding longo e planejamento obrigatório.

## 5. Bud por projeto

Cada projeto possui seu Bud e histórico próprios. Todos começam com uma aparência padrão.

Os incentivos são frases curtas, efeitos dentro do aplicativo, evolução visual do Bud e um histórico de dias ativos que o usuário queira manter preenchido. Não há prêmios materiais.

A evolução principal depende dos dias ativos acumulados. Fazer muitos commits, sessões ou tarefas no mesmo dia não multiplica essa evolução. Eventos individuais podem ter mensagens e efeitos.

O Bud reconhece a dedicação sem cobrar desempenho. Sua comunicação deve ser leve e natural, sem ameaças ou sofrimento pela ausência. Não é um chatbot completo.

As formas visuais, os marcos de evolução e os textos serão detalhados durante a implementação e o design.

## 6. Frequência e sequência

- Padrão diário, com todos os dias da semana selecionados.
- Permitir escolher dias específicos da semana nas configurações.
- Dias de descanso configurados não interrompem a sequência.
- Contar cada dia ativo uma única vez por projeto.
- Perder um dia previsto interrompe a sequência.
- Preservar o histórico e toda a evolução visual já conquistada.
- Incentivar o começo de uma nova sequência quando o usuário voltar.
- Não incluir recurso de pausa, férias ou justificativas de ausência.

Usar um fuso configurado no VibeBud para agrupar os eventos por dia. Aplicar regras consistentes na interface, no backend e na persistência.

## 7. Fontes de atividade

Um dia fica ativo quando houver pelo menos uma fonte válida no projeto. Não exigir todas as fontes.

### Commits

- Recomendar fortemente a conexão GitHub, explicando o registro automático e a confirmação de atividade.
- Contar somente commits atribuídos ao dono da conta conectada, no repositório vinculado ao projeto.
- Aceitar qualquer branch desse repositório.
- Deduplicar commits que apareçam em mais de uma branch.
- Excluir atividade feita exclusivamente por colaboradores ou bots.
- Commits feitos com auxílio de IA continuam válidos quando atribuídos ao usuário.
- Não avaliar tamanho, qualidade ou relevância técnica das alterações.

### Sessões com timer

- Vincular a sessão ao projeto.
- Contar quando o usuário encerrar a sessão e confirmar que se dedicou ao projeto.
- Não exigir duração mínima, tarefa concluída ou resultado técnico positivo.
- Apenas iniciar ou deixar o timer aberto não registra o dia automaticamente.
- Notas de resultado e bloqueios podem apoiar a retomada, sem registro extenso obrigatório.

### Tarefas concluídas

- Uma tarefa explicitamente marcada como concluída também pode registrar atividade.
- Não concluir tarefas automaticamente por existir commit ou sessão.
- Não contabilizar repetidamente o mesmo evento de conclusão.

### Combinação das fontes

Combinar as fontes sem multiplicar o dia ativo ou a evolução principal.

Identificar a origem: registrada pelo usuário, confirmada pelo GitHub ou uma combinação. O GitHub confirma a existência do registro de commit; não comprova esforço real ou qualidade. Sessões e tarefas são declarações do usuário. O modelo híbrido aceita essa limitação.

## 8. Datas e sincronização

Usar a data de autoria do commit, no fuso configurado no VibeBud.

- Commit criado localmente na terça e enviado na quarta pode preencher terça após sincronizar.
- Trabalho feito na terça, com commit criado na quarta, não pode ser atribuído à terça somente pelo commit. Uma sessão ou tarefa registrada na terça pode registrar esse dia.

Sincronizações podem preencher dias anteriores e recompor a sequência.

Falhas de consulta não são prova de ausência. Mostrar atividade pendente de sincronização e recalcular quando os dados estiverem disponíveis, sem anunciar perda definitiva enquanto a consulta estiver falhando.

A integração deve consultar autoria, branches e histórico suficientes, persistir os registros e eliminar duplicações. Mostrar apenas os últimos commits da branch principal não atende a essas regras.

## 9. Uso sem GitHub

Permitir recusar a conexão e continuar com sessões e tarefas manuais.

Manter Bud, sequência, histórico e efeitos. Explicar a limitação concreta: registrar a própria atividade e não contar com confirmação automática dos commits.

Não bloquear o aplicativo nem apresentar registros manuais como verificados. As fontes manuais também podem complementar o GitHub no modelo híbrido.

## 10. Notificações pelo navegador

O navegador é o único canal inicial. Email e WhatsApp ficam fora da primeira versão.

- Solicitar autorização para as notificações.
- Buscar entrega mesmo com a página fechada, quando navegador e dispositivo oferecerem suporte.
- Enviar um lembrete por projeto em cada dia previsto, no horário escolhido.
- Dispensar o lembrete se já houver atividade registrada naquele projeto no dia.
- Na ausência de atividade, continuar nos próximos dias previstos.
- Permitir desativação fácil nas configurações.
- Usar mensagens curtas do Bud com acesso ao projeto.
- Não exigir explicação para a ausência.

Tratar suporte, permissões e sincronização de forma honesta. Não prometer entrega garantida. Implementar a infraestrutura necessária para página fechada: um temporizador que só roda na página aberta não atende ao comportamento desejado.

## 11. Conclusão

O usuário marca explicitamente o projeto como concluído. Isso encerra o acompanhamento e os lembretes, preservando Bud e histórico.

Commits, sessões e tarefas isoladas não concluem automaticamente o projeto.

Manutenção ou melhorias são outro projeto, criado pelo usuário com esse objetivo e com um novo Bud padrão.

## 12. Escopo

A beta inclui conta e nuvem; cadastro e tarefas sugeridas por IA; GitHub opcional; sessões e tarefas como sinais adicionais; frequência configurável; histórico e sequência; Bud por projeto com evolução visual; notificações pelo navegador; conclusão com preservação do histórico.

Ficam fora: cobrança, email, WhatsApp, pausas justificadas, avaliação de desempenho ou qualidade do código, editor, agente de programação, chatbot completo, monitoramento do computador, leitura automática de arquivos locais, ranking público, rede social, equipes, marketplace, aplicativo desktop nativo e sistema complexo de prêmios.

## 13. Diretrizes técnicas

Examinar o repositório existente antes de alterar a arquitetura. Aproveitar as convenções adequadas ao novo escopo e entregar incrementos executáveis.

Separar regras de atividade, frequência, sequência e evolução dos componentes visuais. Preservar a origem dos eventos e evitar duplicações ao sincronizar novamente.

Implementar persistência real, validação e autorização por usuário e projeto. Não expor segredos de GitHub, IA ou infraestrutura no frontend.

Manter o uso possível diante de falhas da geração de tarefas ou do GitHub, comunicando o estado real.

Respeitar a referência visual fornecida para o produto. Não substituir a identidade definida por uma nova linguagem visual.

### Lacunas conhecidas da implementação atual

- A persistência principal é local; conta e nuvem ainda precisam atender ao plano.
- O GitHub atual é um feed e não alimenta a frequência pelas regras decididas.
- A progressão por sessões e tarefas precisa mudar para dias ativos.
- O Bud precisa ter estado e evolução visual próprios por projeto.
- Preferências de lembrete salvas ainda não equivalem a notificações enviadas.
- A geração de tarefas por IA faz parte do novo escopo.

Essas lacunas não devem ser apresentadas como funcionalidades já entregues.

## 14. Critérios de aceitação

1. Criar conta e projeto, persistir e recuperar os dados em outra sessão.
2. Gerar sugestões de tarefas e permitir editar, dispensar ou seguir após falha.
3. Usar o produto sem GitHub, com origem manual identificada.
4. Contar apenas commits do dono no repositório vinculado, em qualquer branch e sem duplicação.
5. Contar sessão encerrada e confirmada sem duração mínima ou tarefa concluída.
6. Registrar atividade por tarefa concluída, sem repetir o evento.
7. Combinar fontes sem multiplicar dias ativos ou evolução.
8. Respeitar frequência e fuso configurados.
9. Preencher dias anteriores pela data de autoria dos commits e recompor a sequência.
10. Diferenciar falha de sincronização de ausência.
11. Interromper sequência por falta em dia previsto, preservando histórico e evolução.
12. Manter Bud e histórico separados por projeto.
13. Enviar lembretes autorizados pelo navegador conforme suporte, inclusive com a página fechada; dispensá-los se houver atividade registrada no dia.
14. Encerrar acompanhamento e lembretes ao concluir o projeto.
15. Tratar erros de persistência, validação e autorização sem indicar sucesso falso.

Executar testes significativos para autoria e deduplicação, combinação de fontes, datas e fuso, frequência e sequência, isolamento por projeto e encerramento dos lembretes. Verificar notificações em navegador compatível. Não declarar testes aprovados sem executá-los.

## 15. Ordem de implementação

1. Revisar o modelo de dados para contas, projetos, fontes de atividade e Buds.
2. Implementar autenticação, autorização e persistência na nuvem.
3. Implementar regras de frequência, sequência e combinação de fontes, com testes.
4. Adequar GitHub a autoria, branches, datas e sincronização.
5. Implementar cadastro e sugestões de tarefas por IA.
6. Integrar histórico visual, efeitos e evolução dos Buds aos eventos reais.
7. Implementar e verificar as notificações pelo navegador.
8. Validar conclusão de projeto e o fluxo completo da beta.

Evitar infraestrutura e abstrações que não sejam necessárias ao escopo.

# Implementação — VibeBud

Criar landing pública em `/` no React/TypeScript/Vite existente. Preservar o app e seu armazenamento. Mover a decisão de boas-vindas ou retomada, anteriormente em `/`, para `/app`. CTAs de conhecer/entrar levam a `/app`; páginas internas mantêm suas rotas.

Direção aprovada: segunda imagem (`design/mobile-v1.png`), com layout desktop e versão mobile reorganizada. Fundo neutro #0B0B0C, superfícies #161617, bordas #2B2B2E, destaque #FF7900, tipografia Inter existente, largura máxima 1160px e respiro de 80–100px entre seções. Reutilizar marca e artes locais do Buddy; não implementar a página como imagem. Preview do produto deve ser HTML acessível, identificado como ilustrativo.

Seções: header com âncoras e acesso ao app; hero com título “Você começa com uma ideia. O VibeBud te ajuda a terminar.”, CTA e robô; preview ilustrativo; benefícios em três cards; processo em três passos; integração GitHub com exemplo de atividade; oferta horizontal VibeBud sem preço; FAQ; CTA final com arte de notebook; footer.

Conteúdo factual: planejamento, tarefas, sessões, registro de bloqueios, progresso e Buddy existem; GitHub depende da conexão/configuração da App; projetos ainda são salvos no navegador. Não prometer escrita de código, IA de planejamento, cloud sync, teste gratuito, preço, checkout ou segurança comercial não comprovados. Sem depoimentos, usuários fictícios ou logos de clientes.

Interações: âncoras com compensação do header, menu mobile com Escape/fechamento ao navegar e aria-expanded, FAQ em details/summary, CTAs reais. Motion: entrada por opacity/translate 500ms, hover 180ms; sem esconder conteúdo, respeitar prefers-reduced-motion e preferência global. Mobile em uma coluna, botões de pelo menos 44px, sem overflow em 320px. No preview, recursos ocultos por breakpoint são decorativos e não funções necessárias.

Metadados próprios para a landing e restauração do título ao entrar no app. Sem canonical/domínio fictício, rastreamento ou nova dependência. Verificar build, lint, testes existentes e navegador quando disponível. Registrar pendências reais de preço/checkout e limites da revisão visual.

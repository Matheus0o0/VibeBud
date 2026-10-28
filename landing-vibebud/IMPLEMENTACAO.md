# Landing VibeBud — entrega local

Página pública: `/`. Aplicativo: `/app`, com o fluxo anterior de boas-vindas, home e retomada. Instalação PWA inicia no app. Execução: `npm run dev`. Build: `npm run build`.

Referência: segunda imagem aprovada pelo usuário, `design/mobile-v1.png`, que apesar do nome apresenta composição desktop. A implementação usa componentes React e CSS, não a imagem como página. Reutiliza os assets locais do Buddy. Código em `src/pages/Landing.tsx`, `src/components/LandingPreview.tsx` e `src/styles/landing.css`.

## Conteúdo e interações

Header, hero, preview ilustrativo, benefícios, processo, GitHub, oferta sem valores, FAQ, CTA final e footer. Menu mobile fecha ao navegar e com Escape. FAQ usa details/summary nativos. Acesso ao app verificado sem criar ou apagar dados. Não há checkout, valores, login de usuário ou assinatura simulados.

Animações solicitadas durante a implementação: entrada do hero, flutuação suave do Buddy, aura e partículas discretas, reveal de 20 blocos por IntersectionObserver com stagger, preenchimento do progresso ilustrativo, spotlight nos cards e no hero, brilho e deslocamento de setas nos botões, rolagem suave e indicador de leitura. Fallback estático respeita prefers-reduced-motion e a preferência salva do aplicativo. Efeitos não alteram os dados do projeto.

## Verificação

- Build TypeScript/Vite aprovado.
- Lint sem erros; permanecem cinco avisos anteriores em App, CreateProject, Session, SessionEnd e Toast.
- 15 testes existentes da API GitHub aprovados.
- Overflow conferido no navegador em 320, 360, 390, 768, 1366 e 1440px, sem elementos extrapolando a largura.
- Inspeção visual desktop e mobile; menu, âncoras, Escape, FAQ e link Entrar testados.
- Verificadas ativação do IntersectionObserver, animação do mascote e progresso de leitura durante rolagem.
- Capturas reais salvas em `design/screenshots/`.

Não foi alterada a preferência de movimento do sistema operacional durante a revisão; o fallback foi conferido no código. Prévia local, sem publicação ou cobrança. Configuração da GitHub App, preços e checkout continuam como etapas comerciais/de integração futuras.

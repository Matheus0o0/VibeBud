# Scroll Cinema do VibeBud

A cena atual usa um modelo 3D articulado em tempo real (Three.js). Ela substitui o antigo vídeo de aproximação, que continua no diretório como experimento anterior e não é carregado pela landing.

## Narrativa e movimento

O Buddy observa uma estrutura incompleta, busca a peça no pedestal, examina perto do rosto, ilumina o encaixe e posiciona a peça. Depois, três módulos completam a estrutura enquanto ele acompanha. A câmera permanece fixa durante a rolagem. Subir reverte todos os movimentos deterministicamente, sem duplicar a peça.

O progresso normalizado controla os braços por cinemática inversa, dedos, cabeça, olhos, peça, encaixe e módulos. Os textos HTML acompanham três capítulos. O indicador representa a apresentação, não dados de um projeto real.

## Correção de braços e paleta

Segmentos dos braços de 0,52 e 0,54 unidades, alcance limitado a 1,04 e cotovelos orientados para fora. A mão de repouso fica abaixo do ombro. Os dedos acompanham a mesma peça durante a transferência.

Corpo em grafite escuro, acabamento preto e detalhes laranja #FF7900. Os detalhes usam material sem tone mapping para evitar que o laranja vire amarelo sob a iluminação. Exposição e luz ambiente reduzidas preservam o grafite.

## Arquivos

- src/lib/buildStory.ts: poses determinísticas e trajetória da peça.
- src/lib/buddyBuildScene.ts: modelo, articulações, materiais e renderização.
- src/components/ScrollCinema.tsx: progresso da rolagem e capítulos.
- src/styles/scroll-cinema.css: layout sticky e responsividade.
- public/assets/cinema/build-poster.jpg: imagem de carregamento capturada da cena atual.
- server/build-story.test.mjs: alcance, contato, continuidade, reversibilidade e conclusão.

A cena é importada sob demanda. ResizeObserver acompanha o tamanho do painel; recursos WebGL são descartados ao desmontar. Sem WebGL, o poster mantém a apresentação legível. Movimento reduzido apresenta a construção final estática. Não houve geração paga de vídeo ou imagem para esta cena.

## Validação

21 testes aprovados, incluindo 6 da construção e 15 da integração GitHub. Build aprovado. Lint sem erros, com cinco avisos preexistentes em outros componentes. O bundle 3D separado tem cerca de 557 kB minificado / 140 kB gzip e gera aviso de tamanho no build.

Conferidas as poses de repouso, exame e encaixe no desktop 1440×900 e a composição em celular 390×844. Capturas em design/build-story. Tudo permanece local, sem publicação externa.

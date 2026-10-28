# VibeBud

Um companheiro que gamifica o desenvolvimento de projetos com IA para incentivar constância. O Bud, o histórico visual e os lembretes ajudam a manter o vínculo com o projeto, sem cobrar velocidade, qualidade do código ou quantidade de entregas.

> Em desenvolvimento. O plano da beta está em [descricao-projeto.md](descricao-projeto.md); algumas funcionalidades planejadas ainda não estão implementadas.

## Estado atual

- Landing page e aplicativo web com suporte a PWA.
- Cadastro de projetos, etapas, tarefas, bloqueios e notas.
- Sessões com timer, histórico, progresso e sequência.
- Buddy com mensagens, estados e efeitos visuais iniciais.
- Integração opcional com GitHub App para vincular repositórios e consultar commits, pull requests e issues.
- Dados do aplicativo salvos localmente no navegador.

A integração GitHub atual é informativa: inclui atividade de colaboradores e não altera automaticamente tarefas, sequência ou evolução do Bud. As sessões GitHub ficam temporariamente na memória do servidor.

### Previsto para a beta

- Conta e persistência na nuvem.
- Tarefas iniciais sugeridas por IA, editáveis e opcionais.
- Um Bud por projeto, com evolução baseada em dias ativos.
- Frequência diária por padrão, configurável por dias da semana.
- Atividade combinada de commits do dono no repositório vinculado, sessões confirmadas e tarefas concluídas.
- Notificações pelo navegador, inclusive com a página fechada quando houver suporte e autorização.
- Conclusão do projeto com preservação do Bud e do histórico.

O cliente Supabase está preparado, mas a camada de dados ainda usa armazenamento local. Salvar preferências de lembrete não significa que notificações estejam sendo enviadas. Cobrança, email e WhatsApp ficam fora da beta inicial.

## Stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, Zustand, React Router, Three.js e Node.js. A PWA usa vite-plugin-pwa; os testes do servidor usam o test runner nativo do Node.

## Executar localmente

Use Node.js 24 e npm. O repositório inclui package-lock.json.

```bash
git clone https://github.com/Matheus0o0/VibeBud.git
cd VibeBud
npm ci
npm run dev
```

Abra a URL exibida pelo Vite, normalmente [localhost:5173](http://localhost:5173).

- `/`: landing page.
- `/app`: entrada do aplicativo.
- `/github`: conexão e vínculo com um repositório.

É possível usar o aplicativo local sem configurar serviços externos. A integração GitHub exige configuração adicional.

## Variáveis de ambiente

Copie .env.example para .env.local e preencha apenas o que precisar:

| Variável | Uso |
| --- | --- |
| VITE_SUPABASE_URL | URL do cliente Supabase preparado para integração futura. |
| VITE_SUPABASE_ANON_KEY | Chave pública do cliente Supabase; não habilita persistência na nuvem por si só. |
| GITHUB_CLIENT_ID | Client ID da GitHub App. |
| GITHUB_CLIENT_SECRET | Segredo da GitHub App, usado exclusivamente no servidor. |
| GITHUB_APP_SLUG | Nome da GitHub App na URL de instalação. |
| APP_ORIGIN | Origem do aplicativo, como http://localhost:5173. |
| PORT | Porta da API independente; padrão 3001. |

Não coloque segredos do servidor em variáveis com prefixo `VITE_`. Arquivos .env locais e chaves privadas devem ficar fora do Git; .env.example contém apenas o modelo.

### GitHub

O fluxo usa uma **GitHub App**, com permissões de leitura. Em desenvolvimento, a API é integrada ao Vite: `npm run dev` já atende às rotas `/api/github/*`.

Siga [GITHUB-INTEGRACAO.md](GITHUB-INTEGRACAO.md) para criar a App, configurar permissões, callback e origem, e conectar repositórios privados. A configuração local padrão de callback é `http://localhost:5173/api/github/callback`.

## Comandos

| Comando | Função |
| --- | --- |
| npm run dev | Inicia o Vite e a API GitHub integrada para desenvolvimento. |
| npm run build | Verifica TypeScript e gera o build em dist/. |
| npm run lint | Executa Oxlint. |
| npm test | Executa os testes do servidor, sem credenciais GitHub reais. |
| npm run preview | Abre uma prévia local do build. |
| npm run start:api | Inicia a API Node independente, carregando .env.local se existir. |

Os comandos de verificação não substituem a validação da autorização GitHub real nem da entrega de notificações em dispositivos compatíveis.

## Publicação

O build gera arquivos estáticos em dist/. Configure fallback para index.html nas rotas do aplicativo.

Para a integração GitHub, também é necessário executar `npm run start:api` e encaminhar `/api/github/*` para a API por um proxy HTTPS. Configure `NODE_ENV=production`, `APP_ORIGIN` e as credenciais no servidor.

A API escuta em 127.0.0.1:3001 por padrão. `npm run preview` serve para prévia local. Consulte as limitações de sessão e os detalhes de publicação em [GITHUB-INTEGRACAO.md](GITHUB-INTEGRACAO.md).

## Estrutura

```text
src/
  components/       Componentes e cenas do Bud
  pages/            Landing e telas do aplicativo
  lib/              Estado, regras e clientes de integração
  styles/           Estilos da landing e animações
server/             API GitHub e testes
public/             Ícones, imagens e mídia usada pelo aplicativo
scripts/            Utilitários de geração de mídia
landing-vibebud/     Briefing, referências e revisões da landing
```

## Documentação

- [Plano de produto e escopo da beta](descricao-projeto.md)
- [Integração GitHub](GITHUB-INTEGRACAO.md)
- [Especificação da interface](descricao-ui-completa.md)
- [Registro de implementação da interface](UI-IMPLEMENTACAO.md)
- [Briefing da landing](landing-vibebud/brief.md)

## Licença

Consulte [LICENSE](LICENSE).

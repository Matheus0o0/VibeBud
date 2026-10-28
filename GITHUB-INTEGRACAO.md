# GitHub no VibeBud

## O que está implementado

- Conectar uma conta via autorização de GitHub App com state e PKCE S256.
- Instalar a App somente nos repositórios escolhidos, incluindo privados.
- Listar os repositórios acessíveis à combinação usuário + instalação, com paginação.
- Vincular um repositório a cada projeto existente do VibeBud.
- Consultar os últimos 10 commits da branch padrão, 10 pull requests atualizados e as issues presentes entre os 20 itens mais recentemente atualizados do endpoint de issues.
- Diferenciar PR aberto, fechado e integrado; excluir PRs da lista de issues.
- Atualizar manualmente ou a cada 2 minutos enquanto a página GitHub estiver visível.
- Tratar repositório vazio, limite de API, perda de acesso, sessão expirada e falhas parciais de permissão.
- Desconectar revogando o token emitido e apagando a sessão no servidor. Isso não desinstala a App da organização.

A atividade é do repositório, incluindo colaboradores. Não é uma medida de produtividade individual. Nenhuma atividade altera automaticamente tarefas, percentual de conclusão, sessões, sequência ou XP.

## Ativar no desenvolvimento

1. Em GitHub → Settings → Developer settings → GitHub Apps, escolha **New GitHub App**. Não use OAuth App.
2. Configure Homepage URL e Setup URL com a origem usada para abrir o VibeBud, por exemplo `http://localhost:5173`; a Setup URL pode apontar para `http://localhost:5173/github`.
3. Configure **Callback URL** como `http://localhost:5173/api/github/callback`.
4. Habilite **Request user authorization (OAuth) during installation**, quando disponível. Mantenha habilitada a expiração de user access tokens. A implementação pede nova conexão quando a sessão expira; não armazena refresh tokens.
5. Desative o webhook nesta primeira versão. A atualização usa consultas à API enquanto a tela estiver aberta.
6. Em Repository permissions, configure somente **Contents: Read-only**, **Issues: Read-only**, **Pull requests: Read-only**. Metadata é leitura implícita. Não são necessárias permissões de escrita, conta ou organização.
7. Para outras pessoas conectarem suas contas, permita instalação **Any account**. Para testar somente com a própria conta, escolha a opção restrita à sua conta.
8. Copie `.env.example` para `.env.local` e preencha no seu editor:

```dotenv
GITHUB_CLIENT_ID=client-id-da-github-app
GITHUB_CLIENT_SECRET=client-secret-da-github-app
GITHUB_APP_SLUG=nome-da-app-na-url-do-github
APP_ORIGIN=http://localhost:5173
```

Use **Client ID**, não App ID. Gere o Client Secret nas configurações da App. Não envie o segredo no chat nem coloque prefixo `VITE_` nas variáveis do GitHub. Não é necessária chave privada PEM para o fluxo de user access tokens utilizado aqui.

9. Reinicie `npm run dev`. A API funciona no mesmo processo do Vite; não precisa iniciar outro serviço em desenvolvimento.
10. Abra `/github`, conecte a conta, autorize a App e instale-a nos repositórios desejados. Se a lista estiver vazia, use **Autorizar repositórios no GitHub**, escolha os repositórios e depois **Atualizar lista**.
11. Escolha um projeto do VibeBud, selecione um repositório e clique em **Vincular repositório**.

Se usar a prévia da rede `http://192.168.0.218:5173`, todas as URLs acima e `APP_ORIGIN` precisam usar essa mesma origem. Não alterne entre localhost, 127.0.0.1 e IP depois da autorização: cookies são vinculados ao host. Para dados privados, prefira localhost no desenvolvimento e HTTPS em produção. Use outro porto livre se já houver um servidor local ocupando 5173.

Organizações podem exigir aprovação de um administrador ou uma sessão SAML SSO ativa. O VibeBud não contorna essas restrições.

## Armazenamento e limites desta versão

As credenciais GitHub ficam exclusivamente no servidor. O navegador recebe um identificador de sessão aleatório em cookie HttpOnly, SameSite=Lax, com Secure em HTTPS. As respostas da API usam Cache-Control: no-store. Os dados de atividade não são persistidos pelo VibeBud no localStorage. O vínculo salvo no projeto contém somente ID/nome/visibilidade do repositório e ID da conta que fez o vínculo; nomes de repositórios privados também são metadados privados e aparecem na exportação local do projeto.

As sessões ficam em memória, por até 8 horas ou até a expiração informada pelo GitHub. Reiniciar o Vite/API exige reconectar. Não há atualização em segundo plano quando o app está fechado, webhook, importação de issues como tarefas, sincronização de projetos entre dispositivos nem renovação automática de tokens.

## Publicação

O build Vite gera somente arquivos estáticos. A integração com repositórios privados exige também a API Node, iniciada por `npm run start:api`. O servidor escuta `127.0.0.1:3001` (ou `PORT`), atrás de um proxy HTTPS que encaminhe `/api/github/*`; os demais caminhos servem `dist` com fallback SPA. Configure `NODE_ENV=production`, `APP_ORIGIN=https://seu-dominio` e as credenciais como segredos no servidor. O comando de API carrega `.env.local` se existir, mas em hospedagem prefira variáveis de ambiente da plataforma.

`npm run preview` é apenas prévia local, não um servidor de produção. Antes de distribuir em múltiplas instâncias, substitua a sessão em memória por um armazenamento compartilhado com TTL, proteção criptográfica dos tokens e limites de requisição no proxy. A API não usa Supabase nesta versão; o armazenamento de projetos existente continua local.

## Verificação

`npm test` executa testes de integração da API com respostas GitHub controladas, sem contas ou credenciais reais. `npm run build` verifica TypeScript e build de produção. A autorização real e a leitura de um repositório privado precisam ser validadas após configurar a GitHub App.

Referências oficiais: [user access tokens e PKCE](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app), [instalações e repositórios autorizados](https://docs.github.com/en/rest/apps/installations), [permissões](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app), [revogação de token](https://docs.github.com/en/rest/apps/oauth-applications).

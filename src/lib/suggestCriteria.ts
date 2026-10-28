const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

type Rule = { match: RegExp; text: string }

// ponytail: static keyword rules, no AI (spec forbids for v1). Order = priority.
const rules: Rule[] = [
  { match: /\b(login|cadastro|usuari|conta|auth|autentic)/, text: 'Fluxo de autenticação funcionando' },
  { match: /\b(pagament|stripe|assinatur|checkout|cobranca)/, text: 'Pagamento integrado e testado' },
  { match: /\b(banco|salvar|persist|supabase|firebase|postgres|mongo|database)/, text: 'Dados persistem corretamente' },
  { match: /\b(api|integrac|webhook|rest|graphql)/, text: 'Integração externa validada' },
  { match: /\b(ia|gpt|llm|openai|claude|anthropic)/, text: 'Respostas da IA revisadas em casos reais' },
  { match: /\b(admin|dashboard|painel)/, text: 'Painel administrativo funcional' },
  { match: /\b(notific|email|e-mail|push)/, text: 'Envio de notificações testado' },
  { match: /\b(formular|form\b|questionari)/, text: 'Formulários com validação' },
  { match: /\b(mobile|android|ios)/, text: 'Funcional em dispositivos móveis' },
  { match: /\b(pwa|instal)/, text: 'Instalável como PWA' },
  { match: /\b(upload|arquiv|imagem|foto)/, text: 'Upload de arquivos funcionando' },
  { match: /\b(busca|filtro|pesquis|search)/, text: 'Busca e filtros retornando resultados corretos' },
  { match: /\b(web|site|plataforma|saas|app)/, text: 'Deploy em produção com URL pública' },
]

const baseline = [
  'Funcionalidades principais implementadas',
  'Projeto publicado',
]

export const suggestCriteria = (description: string, goal: string, max = 5): string[] => {
  const text = norm(`${description} ${goal}`)
  if (!text.trim()) return baseline
  const matched = rules.filter((r) => r.match.test(text)).map((r) => r.text)
  const combined = [...baseline, ...matched]
  const unique: string[] = []
  for (const c of combined) if (!unique.includes(c)) unique.push(c)
  return unique.slice(0, max)
}

export const suggestCriteriaText = (description: string, goal: string, max = 5): string =>
  suggestCriteria(description, goal, max).map((c) => `• ${c}`).join('\n')

if (import.meta.env.DEV && typeof window !== 'undefined' && !(window as any).__suggestChecked) {
  ;(window as any).__suggestChecked = true
  const has = (arr: string[], frag: string) => arr.some((s) => s.toLowerCase().includes(frag))
  const empty = suggestCriteria('', '')
  console.assert(empty.length === 2, 'baseline on empty')
  const web = suggestCriteria('App web de tarefas com login', 'Publicar o SaaS')
  console.assert(has(web, 'autenticação'), 'detects auth')
  console.assert(has(web, 'url pública'), 'detects deploy')
  const ia = suggestCriteria('Recomendação com GPT', 'Usuário recebe sugestões')
  console.assert(has(ia, 'ia'), 'detects AI')
  console.assert(suggestCriteria('x', 'y', 3).length <= 3, 'respects max')
}

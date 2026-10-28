import { useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown, FileText, GitCommitHorizontal, GitFork, GitPullRequest, ListTodo, Menu, Target, X } from 'lucide-react'
import Brand from '../components/Brand'
import LandingPreview from '../components/LandingPreview'
import ScrollCinema from '../components/ScrollCinema'
import { useStore } from '../lib/store'
import '../styles/landing.css'

const navigation = [{ href: '#produto', label: 'Produto' }, { href: '#como-funciona', label: 'Como funciona' }, { href: '#plano', label: 'Plano' }, { href: '#duvidas', label: 'Dúvidas' }]
const features = [
  { icon: ListTodo, title: 'Próximo passo claro', description: 'Divida sua ideia em etapas e saiba o que fazer agora. Menos decisões soltas, mais direção.' },
  { icon: Target, title: 'Foco sem complicação', description: 'Abra uma sessão, trabalhe na tarefa e registre o que avançou. Um passo possível de cada vez.' },
  { icon: BarChart3, title: 'Seu progresso visível', description: 'Acompanhe suas tarefas, reconheça cada avanço e veja o Buddy evoluir com você.' },
]
const steps = [
  { icon: FileText, title: 'Defina seu projeto', description: 'Dê um nome à ideia, defina o que significa terminar e organize as primeiras etapas.' },
  { icon: Target, title: 'Dê o próximo passo', description: 'Escolha uma tarefa pequena e comece. Se aparecer um bloqueio, registre o caminho para resolvê-lo.' },
  { icon: BarChart3, title: 'Acompanhe sua evolução', description: 'Veja o que já fez e encontre o ponto de partida para a próxima sessão. Mesmo depois de uma pausa.' },
]
const faq = [
  { question: 'Preciso usar GitHub?', answer: 'Não. Você pode planejar, registrar sessões e acompanhar seu progresso sem uma conta GitHub. A integração é opcional: quando configurada e conectada, permite consultar a atividade dos repositórios que você autorizar.' },
  { question: 'O VibeBud programa por mim?', answer: 'Não. O VibeBud ajuda você a organizar o projeto, escolher o próximo passo e manter a continuidade. Você continua usando o editor e as ferramentas de programação que preferir.' },
  { question: 'Para quem é o VibeBud?', answer: 'Para quem começa projetos pessoais e quer levá-los até uma primeira versão. Isso inclui quem programa com IA, desenvolvedores independentes e quem está aprendendo a construir suas próprias aplicações.' },
  { question: 'Onde meus projetos ficam salvos?', answer: 'Nesta versão, os projetos ficam salvos no navegador que você usa. Você pode exportar uma cópia nas configurações. A sincronização de projetos entre dispositivos ainda não está disponível.' },
  { question: 'Já posso comprar uma assinatura?', answer: 'Os planos, valores e a forma de pagamento ainda estão sendo definidos. Por enquanto, você pode conhecer o produto e usar os recursos disponíveis no aplicativo. Não há cobrança nesta página.' },
]

function AppLink({ children = 'Conhecer o VibeBud', secondary = false, className = '' }: { children?: ReactNode; secondary?: boolean; className?: string }) {
  return <Link to="/app" className={`lp-button ${secondary ? 'lp-button-secondary' : 'lp-button-primary'} ${className}`}>{children}<ArrowRight size={16} aria-hidden="true" /></Link>
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useStore((s) => s.preferences.reduceMotion)
  useEffect(() => {
    const page = pageRef.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!page) return
    let observer: IntersectionObserver | undefined
    let frame = 0
    const targets = [...page.querySelectorAll<HTMLElement>('.lp-preview, .lp-section-heading, .lp-feature, .lp-steps li, .lp-github-copy, .lp-github-example, .lp-offer, .lp-faq-list details, .lp-final')]
    const progress = () => {
      frame = 0
      const distance = document.documentElement.scrollHeight - window.innerHeight
      page.style.setProperty('--lp-scroll', String(distance > 0 ? Math.min(1, window.scrollY / distance) : 0))
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(progress) }
    const configure = () => {
      observer?.disconnect()
      page.classList.remove('lp-motion-ready')
      document.documentElement.classList.remove('lp-smooth-scroll')
      if (media.matches || reduceMotion || !('IntersectionObserver' in window)) return
      targets.forEach((element) => {
        element.classList.add('lp-reveal')
        const siblings = element.parentElement?.querySelectorAll(':scope > .lp-feature, :scope > li, :scope > details')
        const order = siblings ? [...siblings].indexOf(element) : 0
        element.style.setProperty('--lp-delay', `${Math.max(0, order) * 75}ms`)
      })
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('lp-visible'); observer?.unobserve(entry.target) } })
      }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' })
      targets.forEach((element) => observer?.observe(element))
      page.classList.add('lp-motion-ready')
      document.documentElement.classList.add('lp-smooth-scroll')
    }
    configure()
    progress()
    media.addEventListener('change', configure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      media.removeEventListener('change', configure)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.documentElement.classList.remove('lp-smooth-scroll')
    }
  }, [reduceMotion])
  const spotlight = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--lp-pointer-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--lp-pointer-y', `${event.clientY - bounds.top}px`)
  }
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content') || ''
    document.title = 'VibeBud — sua próxima ideia merece chegar ao fim'
    description?.setAttribute('content', 'Transforme sua ideia em próximos passos. Planeje projetos, mantenha o foco e acompanhe seu progresso com o VibeBud.')
    return () => { document.title = previousTitle; description?.setAttribute('content', previousDescription) }
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('lp-menu-toggle')?.focus() } }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <div className="lp" ref={pageRef}>
      <div className="lp-reading-progress" aria-hidden="true" />
      <a className="lp-skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="lp-header">
        <div className="lp-container lp-header-inner">
          <Brand />
          <nav aria-label="Navegação do site" className="lp-desktop-nav">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
          <div className="lp-header-actions"><Link to="/app" className="lp-login">Entrar <ArrowUpRight size={13} aria-hidden="true" /></Link><AppLink className="lp-header-cta" /></div>
          <button id="lp-menu-toggle" className="lp-menu-toggle" aria-expanded={menuOpen} aria-controls="lp-mobile-menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        {menuOpen && <nav id="lp-mobile-menu" className="lp-mobile-menu" aria-label="Navegação mobile">{navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={15} /></a>)}<Link to="/app" onClick={() => setMenuOpen(false)}>Entrar no aplicativo <ArrowRight size={15} /></Link></nav>}
      </header>

      <main id="conteudo">
        <ScrollCinema />

        <section id="produto" className="lp-container lp-product" aria-label="Conheça a interface do VibeBud"><LandingPreview /></section>

        <section className="lp-container lp-section lp-benefits" aria-labelledby="lp-benefits-title">
          <div className="lp-section-heading"><span className="lp-kicker">MENOS PROJETOS PARADOS. MAIS PRÓXIMOS PASSOS.</span><h2 id="lp-benefits-title">Começar é fácil.<br className="lp-mobile-break" /> Continuar é outra história.</h2><p>Uma estrutura simples para transformar ideias em progresso real.</p></div>
          <div className="lp-features">{features.map(({ icon: Icon, title, description }) => <article key={title} className="lp-feature" onPointerMove={spotlight}><span className="lp-feature-icon"><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>

        <section id="como-funciona" className="lp-workflow lp-section" aria-labelledby="lp-workflow-title"><div className="lp-container"><div className="lp-section-heading"><span className="lp-kicker">SIMPLES PARA COMEÇAR. LEVE PARA CONTINUAR.</span><h2 id="lp-workflow-title">Da ideia à primeira versão.</h2><p>Você não precisa ter todas as respostas. Só um ponto de partida.</p></div><ol className="lp-steps">{steps.map(({ icon: Icon, title, description }, i) => <li key={title}><div className="lp-step-top"><span className="lp-step-number">0{i + 1}</span><Icon size={27} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></li>)}</ol></div></section>

        <section className="lp-container lp-github lp-section" aria-labelledby="lp-github-title"><div className="lp-github-copy"><span className="lp-kicker"><GitFork size={14} aria-hidden="true" /> CONECTE O QUE VOCÊ ESTÁ CONSTRUINDO</span><h2 id="lp-github-title">Seu código também<br />conta a história.</h2><p>Consulte commits, pull requests e issues dos repositórios que você autorizar. Recupere o contexto e veja o que mudou desde a última vez.</p><p className="lp-small-copy">Conexão opcional com GitHub. Você escolhe os repositórios e mantém o controle dos próximos passos.</p><AppLink secondary /></div><figure className="lp-github-example"><div className="lp-github-example-title"><GitFork size={22} aria-hidden="true" /><div><strong>Repositório conectado</strong><span>meu-projeto</span></div><span className="lp-github-dot" aria-label="Exemplo de conexão ativa" /></div>{[{ title: 'feat: implementar formulário de cadastro', id: 'a1b3c4d', icon: GitCommitHorizontal, type: 'Commit' }, { title: 'fix: corrigir validação de e-mail', id: 'd4e5f6g', icon: GitCommitHorizontal, type: 'Commit' }, { title: 'Revisar fluxo de cadastro', id: '#12', icon: GitPullRequest, type: 'Pull request' }].map(({ title, id, icon: Icon, type }) => <div className="lp-github-row" key={id}><Icon size={19} aria-hidden="true" /><div><strong>{title}</strong><code>{id}</code></div><span>{type}</span></div>)}<figcaption>Exemplo ilustrativo de atividade no GitHub.</figcaption></figure></section>

        <section id="plano" className="lp-offer-section lp-section" aria-labelledby="lp-offer-title"><div className="lp-container"><div className="lp-section-heading"><span className="lp-kicker">UM COMPANHEIRO PARA A JORNADA</span><h2 id="lp-offer-title">Um espaço para seu próximo projeto.</h2><p>Planeje, foque e acompanhe a evolução das suas ideias.</p></div><div className="lp-offer"><div className="lp-offer-intro"><span className="lp-offer-name">VibeBud<span className="lp-offer-dot" /></span><p>Organize suas ideias, mantenha o foco<br className="lp-wide-break" /> e dê continuidade ao que você começou.</p></div><ul>{['Planejamento em etapas', 'Sessões de foco', 'Buddy e progresso', 'Conexão com GitHub'].map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul><div className="lp-offer-action"><AppLink /><span>Planos e valores serão anunciados<br />quando a assinatura estiver disponível.</span></div></div></div></section>

        <section id="duvidas" className="lp-container lp-section lp-faq" aria-labelledby="lp-faq-title"><div className="lp-section-heading"><span className="lp-kicker">SEM PONTAS SOLTAS</span><h2 id="lp-faq-title">Antes do próximo passo.</h2><p>Algumas respostas para você conhecer melhor o VibeBud.</p></div><div className="lp-faq-list">{faq.map(({ question, answer }) => <details key={question}><summary>{question}<ChevronDown size={17} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>

        <section className="lp-container lp-final-section" aria-labelledby="lp-final-title"><div className="lp-final"><div className="lp-final-art"><img src="/assets/buddy-desk.png" alt="Buddy trabalhando em um notebook" width="1536" height="1024" loading="lazy" /></div><div className="lp-final-copy"><span className="lp-kicker">BOM, AGORA É COM VOCÊ.</span><h2 id="lp-final-title">Sua próxima ideia<br /><em>merece chegar ao fim.</em></h2><p>Comece pequeno. Volte quando puder.<br />O próximo passo vai estar aqui.</p><AppLink /></div></div></section>
      </main>

      <footer className="lp-footer lp-container"><div><Brand /><p>Seu próximo passo, mais perto.</p></div><nav aria-label="Navegação do rodapé">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><span>Feito para quem quer tirar ideias do papel.</span></footer>
    </div>
  )
}

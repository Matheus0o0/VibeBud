import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ChevronDown, LoaderCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import '../styles/scroll-cinema.css'

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (start: number, end: number, value: number) => { const p = clamp((value - start) / (end - start)); return p * p * (3 - 2 * p) }
type BuildScene = { render: (progress: number) => void; resize: () => void; dispose: () => void }

const phases = [
  { label: 'O projeto parado', title: <>Você começou.<br /><em>Não precisa<br />abandonar.</em></>, description: 'A ideia está aí. Mesmo que você tenha parado no meio, ainda dá para continuar.' },
  { label: 'O próximo encaixe', title: <>Às vezes, só falta<br /><em>o próximo<br />encaixe.</em></>, description: 'Seu Buddy ajuda você a encontrar uma ação possível — e a dar esse passo com mais clareza.' },
  { label: 'A construção continua', title: <>Um passo de<br />cada vez.<br /><em>Seu projeto avança.</em></>, description: 'Você dá o próximo passo. A construção continua, no seu ritmo.' },
]

export default function ScrollCinema() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<BuildScene | null>(null)
  const progressRef = useRef(0)
  const [mediaState, setMediaState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const reduceMotion = useStore((s) => s.preferences.reduceMotion)
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const reduced = reduceMotion || systemReduced
  const reducedRef = useRef(reduced)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setSystemReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const host = worldRef.current
    if (!host) return
    let cancelled = false
    let scene: BuildScene | null = null
    const resize = new ResizeObserver(() => scene?.resize())
    const fail = () => { if (!cancelled) setMediaState('fallback') }
    const timeout = window.setTimeout(fail, 8000)
    import('../lib/buddyBuildScene').then(({ createBuddyBuildScene }) => {
      if (cancelled) return
      scene = createBuddyBuildScene(host)
      sceneRef.current = scene
      scene.render(reducedRef.current ? 1 : progressRef.current)
      resize.observe(host)
      host.querySelector('canvas')?.addEventListener('webglcontextlost', fail)
      window.clearTimeout(timeout)
      setMediaState('ready')
    }).catch(fail)
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      resize.disconnect()
      host.querySelector('canvas')?.removeEventListener('webglcontextlost', fail)
      scene?.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    reducedRef.current = reduced
    let frame = 0
    const panels = [...stage.querySelectorAll<HTMLElement>('.sc-phase')]
    const milestones = [...stage.querySelectorAll<HTMLElement>('.sc-milestone')]
    const apply = () => {
      frame = 0
      const inset = Number.parseFloat(getComputedStyle(stage).top) || 0
      const travel = section.offsetHeight - stage.offsetHeight
      const progress = travel > 0 ? clamp((inset - section.getBoundingClientRect().top) / travel) : 0
      progressRef.current = progress
      const enterMiddle = smooth(0.27, 0.38, progress)
      const exitMiddle = smooth(0.79, 0.88, progress)
      const opacities = [1 - enterMiddle, enterMiddle * (1 - exitMiddle), exitMiddle]
      const offsets = [-25 * enterMiddle, 28 * (1 - enterMiddle) - 25 * exitMiddle, 28 * (1 - exitMiddle)]
      const current = progress < 0.33 ? 0 : progress < 0.84 ? 1 : 2
      stage.style.setProperty('--sc-progress', String(progress))
      stage.dataset.phase = String(current)
      panels.forEach((panel, index) => {
        panel.style.opacity = String(opacities[index])
        panel.style.transform = reduced ? 'none' : `translate3d(0, ${offsets[index]}px, 0)`
        panel.setAttribute('aria-hidden', String(index !== current))
        panel.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => { link.tabIndex = index === current ? 0 : -1 })
        panel.style.pointerEvents = index === current ? 'auto' : 'none'
      })
      milestones.forEach((milestone, index) => { milestone.dataset.active = String(current === index) })
      sceneRef.current?.render(reduced ? 1 : progress)
    }
    const onScroll = () => {
      if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; apply() }
      else if (!frame) frame = window.requestAnimationFrame(apply)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('visibilitychange', onScroll)
    const resizeObserver = new ResizeObserver(onScroll)
    resizeObserver.observe(section)
    resizeObserver.observe(stage)
    apply()
    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', onScroll)
    }
  }, [reduced])

  return (
    <section className={`sc-cinema ${reduced ? 'sc-reduced' : ''}`} ref={sectionRef} aria-label="Da ideia à primeira versão com VibeBud">
      <div className={`sc-stage sc-media-${mediaState}`} ref={stageRef}>
        <img className="sc-poster sc-build-poster" src="/assets/cinema/build-poster.jpg" alt="" width="852" height="742" fetchPriority="high" />
        <div className="sc-world" ref={worldRef} role="img" aria-label="Buddy examina uma peça, ilumina o encaixe e ajuda a construir um projeto incompleto." />
        <div className="sc-scrim" aria-hidden="true" />
        {!reduced && mediaState === 'loading' && <div className="sc-loading" role="status"><LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> Preparando a construção…</div>}
        {!reduced && mediaState === 'fallback' && <span className="sc-fallback-note">Prévia estática · continue rolando para conhecer o VibeBud</span>}
        <div className="lp-container sc-content">
          <div className="sc-copy">
            <span className="lp-eyebrow"><span /> PARA QUEM CRIA. E QUER CONCLUIR.</span>
            <div className="sc-phases">{phases.map((phase, index) => <div key={phase.label} className={`sc-phase sc-phase-${index}`} aria-hidden={index !== 0}>
              {index === 0 ? <h1 id="lp-title">{phase.title}</h1> : <h2>{phase.title}</h2>}
              <p>{phase.description}</p>
              <div className="sc-actions"><Link to="/app" className="lp-button lp-button-primary" tabIndex={index === 0 ? 0 : -1}>Conhecer o VibeBud <ArrowRight size={16} aria-hidden="true" /></Link><a href="#produto" className="sc-skip" tabIndex={index === 0 ? 0 : -1}>Ver o produto <ArrowDown size={13} aria-hidden="true" /></a></div>
            </div>)}</div>
          </div>
          <div className="sc-chapter" aria-hidden="true"><div className="sc-chapter-label"><span>UM ENCAIXE DE CADA VEZ</span><span className="sc-chapter-index"><i>01</i><i>02</i><i>03</i> / 03</span></div><div className="sc-journey-track"><span /></div><div className="sc-milestones">{phases.map((phase, i) => <span key={phase.label} className="sc-milestone" data-active={i === 0}>{phase.label}</span>)}</div></div>
        </div>
        <a href="#produto" className="sc-scroll-hint">Role para explorar <ChevronDown size={14} aria-hidden="true" /></a>
      </div>
    </section>
  )
}

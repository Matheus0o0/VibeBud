import BuddyCharacter from './BuddyCharacter'
import type { BuddyMood } from '../lib/types'

type Props = { scene?: 'desk' | 'celebration' | 'portrait'; mood?: BuddyMood; size?: number }

export default function BuddyScene({ scene = 'portrait', mood = 'neutral', size = 320 }: Props) {
  if (scene === 'portrait') return <BuddyCharacter mood={mood} size={size} />
  if (scene === 'desk') return (
    <div className="buddy-scene" style={{ width: size }}>
      <img src="/assets/buddy-desk.png" alt="Buddy trabalhando em seu notebook, pronto para acompanhar seu projeto" width={size} height={size} decoding="async" />
    </div>
  )
  return <div className="buddy-scene buddy-celebration" style={{ width: size }}><BuddyCharacter mood={mood} size={size} /></div>
}

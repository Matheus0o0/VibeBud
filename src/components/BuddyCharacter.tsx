import type { BuddyMood } from '../lib/types'

type Props = { mood?: BuddyMood; size?: number; glow?: boolean }

const descriptions: Record<BuddyMood, string> = {
  neutral: 'Buddy, seu companheiro de projetos',
  working: 'Buddy acompanhando seu trabalho',
  celebrating: 'Buddy celebrando seu progresso',
  thinking: 'Buddy pensando no próximo passo',
  encouraging: 'Buddy incentivando você',
  returning: 'Buddy dando boas-vindas de volta',
  completed: 'Buddy celebrando a conclusão do projeto',
  evolved: 'Buddy evoluindo junto com você',
}

export default function BuddyCharacter({ mood = 'neutral', size = 160, glow = true }: Props) {
  return (
    <div className={`buddy-character buddy-mood-${mood} ${glow ? 'buddy-glow' : ''}`} style={{ width: size }}>
      <img src="/assets/buddy.png" alt={descriptions[mood]} width={size} height={size} decoding="async" />
    </div>
  )
}

'use client'

import { personalizeText, type PersonalizationVars } from '@/lib/data'
import { HeroAvatar } from '@/components/HeroAvatar'

interface HeroBubbleProps {
  message: string
  childName?: string
  gender?: 'boy' | 'girl'
  className?: string
}

export function HeroBubble({ message, childName, gender = 'boy', className = '' }: HeroBubbleProps) {
  let displayMessage = message
  if (childName && gender) {
    displayMessage = personalizeText(message, { name: childName, gender })
  } else if (childName) {
    displayMessage = message.replace(/\[name\]/g, childName)
  }

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div className="speech-bubble flex-1">
        <p className="text-lg leading-relaxed text-foreground">{displayMessage}</p>
      </div>
      <HeroAvatar size="sm" variant="main" gender={gender} animate={false} />
    </div>
  )
}

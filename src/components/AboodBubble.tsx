'use client'

import Image from 'next/image'
import { personalizeText, type PersonalizationVars } from '@/lib/data'

type AboodVariant = 'main' | 'welcome' | 'reading' | 'coloring' | 'letters'

interface AboodAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: AboodVariant
  className?: string
  animate?: boolean
}

const sizeMap = {
  sm: 64,
  md: 96,
  lg: 128,
  xl: 180,
}

const variantImages: Record<AboodVariant, string> = {
  main: '/images/abood/main.png',
  welcome: '/images/abood/welcome.png',
  reading: '/images/abood/reading.png',
  coloring: '/images/abood/coloring.png',
  letters: '/images/abood/letters.png',
}

export function AboodAvatar({
  size = 'md',
  variant = 'main',
  className = '',
  animate = true,
}: AboodAvatarProps) {
  const px = sizeMap[size]
  const animationClass = animate ? 'animate-float' : ''

  return (
    <div
      className={`relative flex-shrink-0 ${animationClass} ${className}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={variantImages[variant]}
        alt="عبود"
        width={px}
        height={px}
        className="object-contain"
        priority
      />
    </div>
  )
}

interface AboodBubbleProps {
  message: string
  childName?: string
  gender?: 'boy' | 'girl'
  className?: string
}

export function AboodBubble({ message, childName, gender, className = '' }: AboodBubbleProps) {
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
      <AboodAvatar size="sm" variant="main" />
    </div>
  )
}

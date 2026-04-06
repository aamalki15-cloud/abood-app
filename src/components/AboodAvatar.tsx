'use client'

import Image from 'next/image'

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
        className="object-contain mix-blend-multiply"
        priority
      />
    </div>
  )
}

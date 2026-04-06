'use client'

import Image from 'next/image'

type HeroVariant = 'main' | 'welcome' | 'reading' | 'coloring' | 'letters'

interface HeroAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: HeroVariant
  gender?: 'boy' | 'girl'
  className?: string
  animate?: boolean
}

const sizeMap = {
  sm: 64,
  md: 96,
  lg: 128,
  xl: 180,
}

const aboodImages: Record<HeroVariant, string> = {
  main: '/images/abood/main.png',
  welcome: '/images/abood/welcome.png',
  reading: '/images/abood/reading.png',
  coloring: '/images/abood/coloring.png',
  letters: '/images/abood/letters.png',
}

const asalaaImages: Record<HeroVariant, string> = {
  main: '/images/asalaa/main.png',
  welcome: '/images/asalaa/welcome.png',
  reading: '/images/asalaa/reading.png',
  coloring: '/images/asalaa/coloring.png',
  letters: '/images/asalaa/letters.png',
}

export function HeroAvatar({
  size = 'md',
  variant = 'main',
  gender = 'boy',
  className = '',
  animate = true,
}: HeroAvatarProps) {
  const px = sizeMap[size]
  const animationClass = animate ? 'animate-float' : ''
  const images = gender === 'girl' ? asalaaImages : aboodImages
  const alt = gender === 'girl' ? 'عسوله' : 'عبود'

  return (
    <div
      className={`relative flex-shrink-0 ${animationClass} ${className}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={images[variant]}
        alt={alt}
        width={px}
        height={px}
        className="object-contain mix-blend-multiply"
        priority
      />
    </div>
  )
}

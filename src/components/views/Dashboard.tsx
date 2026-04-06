'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { HeroAvatar } from '@/components/HeroAvatar'
import { HeroBubble } from '@/components/HeroBubble'
import { getGuideName } from '@/lib/data'
import Image from 'next/image'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { currentChild, setCurrentView } = useAppStore()
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!currentChild) return null

  const childName = currentChild.name
  const gender = currentChild.gender
  const guideName = getGuideName(gender)

  // Hidden parent settings gesture: tap avatar 3 times quickly
  function handleAvatarTap() {
    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0
    }, 800)
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0
      setCurrentView('parentSettings')
    }
  }

  return (
    <div className="min-h-screen bg-page-magical flex flex-col relative overflow-hidden">
      {/* Background decorative layer */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/backgrounds/magical.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/60" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 p-8 flex flex-col gap-7 max-w-lg mx-auto w-full flex-1"
      >
        {/* Top greeting */}
        <div className="flex items-center gap-4">
          <button onClick={handleAvatarTap} className="flex-shrink-0">
            <div className="animate-soft-glow rounded-full p-1">
              <HeroAvatar size="md" variant="main" gender={gender} />
            </div>
          </button>
          <h1 className="text-3xl font-extrabold text-foreground">
            أهلاً يا {childName}! 💛
          </h1>
        </div>

        {/* Hero bubble */}
        <HeroBubble
          message={`ماذا تريد أن نلعب يا [name]؟`}
          childName={childName}
          gender={gender}
        />

        {/* 3 main cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {/* Stories Card */}
          <motion.button
            variants={item}
            onClick={() => setCurrentView('storiesList')}
            className="card-stories rounded-3xl overflow-hidden shadow-md w-full text-right transition-all min-h-[130px] relative"
          >
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/backgrounds/stories.png"
                alt=""
                fill
                className="object-cover opacity-15"
              />
            </div>
            <div className="relative p-7 flex items-center gap-5">
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-abood-primary">📚 القصص</h2>
                <p className="text-xl text-muted-foreground mt-1">هيا نقرأ معًا!</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-abood-primary/10 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
            </div>
          </motion.button>

          {/* Coloring Card */}
          <motion.button
            variants={item}
            onClick={() => setCurrentView('coloringList')}
            className="card-coloring rounded-3xl overflow-hidden shadow-md w-full text-right transition-all min-h-[130px] relative"
          >
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/backgrounds/coloring.png"
                alt=""
                fill
                className="object-cover opacity-15"
              />
            </div>
            <div className="relative p-7 flex items-center gap-5">
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-abood-fun">🎨 الألوان</h2>
                <p className="text-xl text-muted-foreground mt-1">هيا نلوّن!</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-abood-fun/10 flex items-center justify-center">
                <span className="text-4xl">🖌️</span>
              </div>
            </div>
          </motion.button>

          {/* Letters Card */}
          <motion.button
            variants={item}
            onClick={() => setCurrentView('lettersList')}
            className="card-letters rounded-3xl overflow-hidden shadow-md w-full text-right transition-all min-h-[130px] relative"
          >
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/backgrounds/letters.png"
                alt=""
                fill
                className="object-cover opacity-15"
              />
            </div>
            <div className="relative p-7 flex items-center gap-5">
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-abood-accent">✏️ الحروف</h2>
                <p className="text-xl text-muted-foreground mt-1">هيا نتعلم!</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-abood-accent/10 flex items-center justify-center">
                <span className="text-4xl">🔤</span>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

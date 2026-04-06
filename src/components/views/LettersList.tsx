'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { arabicLetters } from '@/lib/data'
import { HeroBubble } from '@/components/HeroBubble'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.015 },
  },
}

const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1 },
}

export function LettersList() {
  const { currentChild, setCurrentView, setSelectedLetter } = useAppStore()
  const [learnedLetters, setLearnedLetters] = useState<string[]>([])

  useEffect(() => {
    if (!currentChild) return
    async function fetchProgress() {
      try {
        const res = await fetch(`/api/progress?childId=${currentChild.id}`)
        if (res.ok) {
          const data = await res.json()
          const completed = data.letters
            ?.filter((l: { completed: boolean }) => l.completed)
            .map((l: { letter: string }) => l.letter) || []
          setLearnedLetters(completed)
        }
      } catch {
        // Silently handle
      }
    }
    fetchProgress()
  }, [currentChild])

  if (!currentChild) return null

  const learnedCount = learnedLetters.length
  const gender = currentChild.gender

  function handleLetterSelect(index: number) {
    setSelectedLetter(index)
    setCurrentView('letterDetail')
  }

  return (
    <div className="min-h-screen bg-page-letters flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-sky-50/30 to-white/40" />
        <div className="absolute top-16 left-4 text-7xl font-extrabold text-abood-secondary/6 animate-cloud-drift">أ ب</div>
        <div className="absolute top-32 right-6 text-6xl font-extrabold text-abood-sky/6 animate-cloud-drift" style={{ animationDelay: '3s' }}>ت ث</div>
        <div className="absolute bottom-28 left-8 text-5xl font-extrabold text-abood-accent/6 animate-cloud-drift" style={{ animationDelay: '5s' }}>ج ح</div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 p-8 flex flex-col gap-7 max-w-lg mx-auto w-full"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="big-touch p-3 rounded-2xl premium-card active:scale-95 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <h1 className="text-3xl font-extrabold text-foreground">✏️ الحروف العربية</h1>
        </div>

        {/* Abood greeting */}
        <HeroBubble
          message={`هيا نتعلم يا [name]!`}
          childName={currentChild.name}
          gender={gender}
        />

        {/* Progress bar */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="flex-1 h-4 bg-white/80 rounded-full overflow-hidden border border-abood-secondary/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(learnedCount / 28) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6FCF97, #87CEEB)' }}
            />
          </div>
          <span className="text-xl font-bold text-muted-foreground whitespace-nowrap">
            {learnedCount} / 28
          </span>
        </div>

        {/* Letters grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-3"
        >
          {arabicLetters.map((letterData, index) => {
            const isLearned = learnedLetters.includes(letterData.letter)
            return (
              <motion.button
                key={letterData.letter}
                variants={item}
                onClick={() => handleLetterSelect(index)}
                className={`card-active relative rounded-2xl p-3 flex flex-col items-center justify-center gap-1 transition-all min-h-[90px] ${
                  isLearned
                    ? 'bg-abood-secondary/10 ring-2 ring-abood-secondary/30 border border-abood-secondary/20'
                    : 'glass-card border border-white/60'
                }`}
              >
                {isLearned && (
                  <div className="absolute top-1 left-1 w-6 h-6 btn-secondary-premium rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <span className="text-4xl font-extrabold text-foreground leading-none">
                  {letterData.letter}
                </span>
                <span className="text-xl leading-none">{letterData.wordImage}</span>
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}

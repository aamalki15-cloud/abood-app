'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { coloringPages, personalizeText, getCharacter } from '@/lib/data'
import { HeroBubble } from '@/components/HeroBubble'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function ColoringList() {
  const { currentChild, setCurrentView } = useAppStore()
  const [selectedColoring, setSelectedColoring] = useState<number | null>(null)

  if (!currentChild) return null

  const gender = currentChild.gender
  const vars = { name: currentChild.name, gender }

  return (
    <div className="min-h-screen bg-page-coloring flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 via-orange-50/30 to-white/40" />
        <div className="absolute top-16 right-6 w-14 h-14 rounded-full bg-abood-fun/10 animate-float" />
        <div className="absolute top-32 left-8 w-10 h-10 rounded-full bg-abood-warning/15 animate-float-slow" />
        <div className="absolute bottom-40 right-10 w-12 h-12 rounded-full bg-abood-accent/10 animate-float" style={{ animationDelay: '1s' }} />
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
          <h1 className="text-3xl font-extrabold text-foreground">🎨 ألوان مع عبود</h1>
        </div>

        {/* Abood greeting */}
        <HeroBubble
          message={`هيا نلوّن يا [name]!`}
          childName={currentChild.name}
          gender={gender}
        />

        {/* Coloring cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {coloringPages.map((coloring, index) => {
            const char = coloring.characterId ? getCharacter(coloring.characterId) : null
            return (
              <motion.button
                key={coloring.id}
                variants={item}
                onClick={() => setSelectedColoring(index)}
                className="premium-card rounded-3xl overflow-hidden text-right flex flex-col w-full transition-all"
              >
                <div className="img-container-coral h-40 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={coloring.image}
                    alt={coloring.title}
                    width={160}
                    height={130}
                    className="object-contain relative z-10 mix-blend-multiply"
                  />
                  {char && (
                    <div
                      className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md"
                      style={{ backgroundColor: char.color }}
                    >
                      {char.emoji}
                    </div>
                  )}
                </div>
                <div className="p-5 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground flex-1">{coloring.title}</h3>
                  {char && (
                    <span
                      className="text-base px-3 py-1 rounded-full text-white font-bold"
                      style={{ backgroundColor: char.color }}
                    >
                      {char.name}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Full image dialog */}
      <Dialog
        open={selectedColoring !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedColoring(null)
        }}
      >
        <DialogContent className="sm:max-w-lg p-6" dir="rtl">
          {selectedColoring !== null && (
            <div className="flex flex-col gap-6 items-center">
              <h2 className="text-3xl font-bold text-foreground">
                {coloringPages[selectedColoring].title}
              </h2>
              <div className="img-container-coral w-full rounded-3xl p-6 flex items-center justify-center">
                <Image
                  src={coloringPages[selectedColoring].image}
                  alt={coloringPages[selectedColoring].title}
                  width={300}
                  height={250}
                  className="object-contain w-full mix-blend-multiply"
                />
              </div>
              <p className="text-xl text-muted-foreground text-center">
                {personalizeText(coloringPages[selectedColoring].description, vars)}
              </p>
              <button
                onClick={() => setSelectedColoring(null)}
                className="btn-fun-premium w-full py-5 rounded-3xl text-2xl font-bold text-white min-h-[72px]"
              >
                رائع! 🎨
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

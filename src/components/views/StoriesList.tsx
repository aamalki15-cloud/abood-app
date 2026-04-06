'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { stories, getCharacter } from '@/lib/data'
import { HeroBubble } from '@/components/HeroBubble'
import Image from 'next/image'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function StoriesList() {
  const { currentChild, setCurrentView, setSelectedStory } = useAppStore()

  if (!currentChild) return null

  function handleStorySelect(index: number) {
    setSelectedStory(index)
    setCurrentView('storyReader')
  }

  return (
    <div className="min-h-screen bg-page-stories flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/backgrounds/stories.png"
          alt=""
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/50" />
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
          <h1 className="text-3xl font-extrabold text-foreground">📚 القصص</h1>
        </div>

        {/* Abood greeting */}
        <HeroBubble
          message={`هيا نقرأ يا [name]!`}
          childName={currentChild.name}
          gender={currentChild.gender}
        />

        {/* Stories list */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {stories.map((story, index) => (
            <motion.button
              key={story.id}
              variants={item}
              onClick={() => handleStorySelect(index)}
              className="premium-card rounded-3xl overflow-hidden text-right w-full flex flex-col transition-all"
            >
              {/* Cover */}
              <div className="img-container-warm h-48 flex items-center justify-center relative overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={220}
                  height={170}
                  className="object-contain relative z-10 mix-blend-multiply"
                />
              </div>
              {/* Info */}
              <div className="p-6 flex flex-col gap-3">
                <h2 className="text-2xl font-extrabold text-foreground">{story.title}</h2>
                <div className="flex gap-2 flex-wrap">
                  {story.characterIds.map((charId) => {
                    const char = getCharacter(charId)
                    if (!char) return null
                    return (
                      <span
                        key={charId}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-base font-bold text-white"
                        style={{ backgroundColor: char.color }}
                      >
                        {char.emoji} {char.name}
                      </span>
                    )
                  })}
                </div>
                <div
                  className="mt-2 text-center py-4 rounded-2xl text-white font-bold text-2xl min-h-[60px] flex items-center justify-center transition-all"
                  style={{ backgroundColor: story.color }}
                >
                  📖 استمع للقصة
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

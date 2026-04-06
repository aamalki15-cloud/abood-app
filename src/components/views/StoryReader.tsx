'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { stories, personalizeText, getEncouragement, getRandomItem, cleanTextForTTS } from '@/lib/data'
import { HeroAvatar } from '@/components/HeroAvatar'
import { speakWithBrowser, stopBrowserSpeech } from '@/lib/tts'

// Split Arabic text into sentences for gradual reading
function splitIntoSentences(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!؟])\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  return sentences.length > 0 ? sentences : [text]
}

export function StoryReader() {
  const { currentChild, selectedStory, setCurrentView } = useAppStore()
  const [currentPage, setCurrentPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const autoPlayRef = useRef(true)
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)

  const story = selectedStory !== null ? stories[selectedStory] : null
  const childName = currentChild?.name ?? ''
  const childGender = currentChild?.gender ?? 'boy'

  const pageData = story ? story.pages[currentPage] : null
  const rawText = pageData?.text ?? ''
  const displayText = rawText
    ? personalizeText(rawText, { name: childName, gender: childGender })
    : ''

  const sentences = displayText ? splitIntoSentences(displayText) : []

  const [displayEncouragement] = useState(() => {
    const encouragementsList = getEncouragement(childGender)
    return personalizeText(
      getRandomItem(encouragementsList),
      { name: childName, gender: childGender }
    )
  })

  function stopAudio() {
    cancelledRef.current = true
    // Stop browser TTS
    stopBrowserSpeech()
    // Stop server TTS audio element
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaying(false)
    setLoading(false)
    setCurrentSentence(0)
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }
  }

  // Play a single sentence using browser TTS, returns promise
  function playBrowserSentence(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      speakWithBrowser(text, {
        speed: 0.85,
        onEnd: () => resolve(true),
        onError: () => resolve(false),
      })
    })
  }

  // Play a single sentence using server TTS, returns promise
  function playServerSentence(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speed: 0.8 }),
      })
        .then((res) => {
          if (res.ok) return res.blob()
          throw new Error('TTS failed')
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio
          audio.onended = () => {
            URL.revokeObjectURL(url)
            resolve(true)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            resolve(false)
          }
          audio.play()
        })
        .catch(() => resolve(false))
    })
  }

  // Play all sentences of the current page sequentially
  async function playSentencesSequentially() {
    if (sentences.length === 0) return

    cancelledRef.current = false
    setPlaying(true)
    setLoading(true)

    for (let i = 0; i < sentences.length; i++) {
      if (cancelledRef.current) return

      setCurrentSentence(i)
      const cleanSentence = cleanTextForTTS(sentences[i])
      if (!cleanSentence) continue

      setLoading(false)

      // Try browser TTS first
      let success = await playBrowserSentence(cleanSentence)

      if (!success && !cancelledRef.current) {
        // Fall back to server TTS
        success = await playServerSentence(cleanSentence)
      }

      // Pause between sentences for natural reading feel
      if (i < sentences.length - 1 && !cancelledRef.current) {
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, 600)
          // Store timer so we can cancel it on stop
          const checkCancel = setInterval(() => {
            if (cancelledRef.current) {
              clearTimeout(timer)
              clearInterval(checkCancel)
              resolve()
            }
          }, 100)
        })
      }
    }

    if (!cancelledRef.current) {
      setCurrentSentence(sentences.length)
      setPlaying(false)
      setLoading(false)

      // Auto advance to next page after all sentences
      autoAdvanceTimerRef.current = setTimeout(() => {
        setCurrentPage((prev) => {
          if (story && prev < story.pages.length - 1) {
            autoPlayRef.current = true
            return prev + 1
          }
          return prev
        })
      }, 2500)
    }
  }

  function triggerTTS() {
    stopAudio()
    // Small delay to ensure stopAudio completes
    setTimeout(() => {
      cancelledRef.current = false
      playSentencesSequentially()
    }, 100)
  }

  useEffect(() => {
    if (!story || !currentChild) return
    const isLastPage = currentPage === story.pages.length - 1
    if (isLastPage) {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: currentChild.id,
          type: 'story',
          itemId: story.id,
        }),
      }).catch(() => {})
    }
  }, [currentPage, story, currentChild])

  // Auto-play when page changes
  useEffect(() => {
    if (!displayText || !autoPlayRef.current) return
    autoPlayRef.current = false
    const timer = setTimeout(() => {
      triggerTTS()
    }, 800)
    return () => clearTimeout(timer)
  }, [currentPage])

  useEffect(() => {
    return () => {
      stopBrowserSpeech()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
      }
    }
  }, [])

  if (!currentChild || selectedStory === null || !story) return null

  const totalPages = story.pages.length
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  function handlePlayTTS() {
    if (playing || loading) {
      stopAudio()
      return
    }
    triggerTTS()
  }

  function goNext() {
    if (!isLastPage) {
      stopAudio()
      autoPlayRef.current = true
      setCurrentPage((prev) => prev + 1)
    }
  }

  function goPrev() {
    if (!isFirstPage) {
      stopAudio()
      autoPlayRef.current = true
      setCurrentPage((prev) => prev - 1)
    }
  }

  // Determine which sentences to highlight
  const completedSentences = currentSentence >= sentences.length ? sentences.length : currentSentence

  return (
    <div className="min-h-screen bg-page-stories flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/backgrounds/stories.png"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/50" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 p-8 flex flex-col gap-5 max-w-lg mx-auto w-full"
      >
        {/* Top bar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              stopAudio()
              setCurrentView('storiesList')
            }}
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
          <h1 className="text-2xl font-extrabold text-foreground flex-1">{story.title}</h1>
        </div>

        {/* Audio Control Bar */}
        <div className="glass-card rounded-3xl p-5 flex items-center justify-center gap-4">
          <button
            onClick={handlePlayTTS}
            disabled={loading}
            className={`big-touch w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-all ${
              playing
                ? 'btn-fun-premium text-white'
                : loading
                ? 'bg-gray-200 text-white'
                : 'btn-premium text-white'
            }`}
          >
            {playing ? '⏸️' : '🔊'}
          </button>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-foreground">
              {playing ? '⏸️ إيقاف' : '🔊 استمع للقصة'}
            </span>
            {(playing || loading) && (
              <div className="flex items-center gap-2">
                {playing && (
                  <div className="flex gap-1 items-end h-5">
                    <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-1" />
                    <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-2" />
                    <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-3" />
                    <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-4" />
                  </div>
                )}
                {loading && !playing && (
                  <div className="w-4 h-4 border-2 border-abood-primary border-t-transparent rounded-full animate-spin" />
                )}
                <span className="text-lg font-bold text-abood-primary">
                  {playing ? '🔊 جاري القراءة...' : 'جاري التحميل...'}
                </span>
              </div>
            )}
          </div>
          <span className="text-xl font-bold text-muted-foreground mr-auto">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        {/* Illustration */}
        <div className="img-container-warm w-full h-60 rounded-3xl flex items-center justify-center overflow-hidden">
          {pageData?.image ? (
            <Image
              src={pageData.image}
              alt={story.title}
              width={280}
              height={210}
              className="object-contain mix-blend-multiply"
            />
          ) : (
            <HeroAvatar size="lg" variant="reading" gender={childGender} />
          )}
        </div>

        {/* Story Text with sentence highlighting */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="premium-card rounded-3xl p-8"
        >
          <p className="text-2xl leading-loose text-foreground font-medium">
            {sentences.map((sentence, idx) => (
              <span
                key={idx}
                className={`transition-colors duration-300 ${
                  playing && idx === currentSentence
                    ? 'text-abood-primary font-bold'
                    : playing && idx < currentSentence
                    ? 'text-muted-foreground'
                    : ''
                }`}
              >
                {idx > 0 ? ' ' : ''}{sentence}
              </span>
            ))}
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={goPrev}
            disabled={isFirstPage}
            className={`card-active flex-1 py-5 rounded-3xl text-2xl font-bold transition-all min-h-[72px] ${
              isFirstPage
                ? 'bg-gray-100 text-gray-300'
                : 'btn-secondary-premium text-white'
            }`}
          >
            → السابق
          </button>
          <button
            onClick={goNext}
            disabled={isLastPage}
            className={`card-active flex-1 py-5 rounded-3xl text-2xl font-bold transition-all min-h-[72px] ${
              isLastPage
                ? 'bg-gray-100 text-gray-300'
                : 'btn-accent-premium text-white'
            }`}
          >
            التالي ←
          </button>
        </div>

        {/* Celebration on last page */}
        {isLastPage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="glass-card rounded-3xl p-8 text-center w-full">
              <span className="text-6xl animate-sparkle">🎉</span>
              <p className="text-3xl font-extrabold text-abood-primary mt-4">
                {displayEncouragement}
              </p>
            </div>
            <button
              onClick={() => {
                stopAudio()
                setCurrentView('storiesList')
              }}
              className="premium-card w-full py-5 rounded-3xl text-2xl font-bold text-abood-primary min-h-[72px] transition-all"
            >
              📚 العودة للقصص
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

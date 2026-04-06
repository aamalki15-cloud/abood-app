'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { arabicLetters, personalizeText, getEncouragement, getRandomItem, getLetterTTS, getWordTTS, cleanTextForTTS } from '@/lib/data'
import { AboodAvatar } from '@/components/AboodAvatar'
import { HeroBubble } from '@/components/HeroBubble'
import { speakWithBrowser, stopBrowserSpeech } from '@/lib/tts'

export function LetterDetail() {
  const { currentChild, selectedLetter, setCurrentView } = useAppStore()
  const [isLearned, setIsLearned] = useState(false)
  const [playingType, setPlayingType] = useState<'letter' | 'word' | 'encourage' | null>(null)
  const [tapped, setTapped] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const letterData = selectedLetter !== null ? arabicLetters[selectedLetter] : null
  const gender = currentChild?.gender ?? 'boy'

  const letterTTS = letterData ? cleanTextForTTS(getLetterTTS(letterData)) : ''
  const wordTTS = letterData ? cleanTextForTTS(getWordTTS(letterData)) : ''
  const encourageTTS = currentChild
    ? cleanTextForTTS(personalizeText(
        getRandomItem(getEncouragement(currentChild.gender)),
        { name: currentChild.name, gender }
      ))
    : ''

  useEffect(() => {
    if (!currentChild || !letterData) return
    let cancelled = false
    async function checkProgress() {
      try {
        const res = await fetch(`/api/progress?childId=${currentChild.id}`)
        if (res.ok && !cancelled) {
          const data = await res.json()
          const letterProgress = data.letters?.find(
            (l: { letter: string }) => l.letter === letterData.letter
          )
          setIsLearned(letterProgress?.completed || false)
        }
      } catch {
        // Silently handle
      }
    }
    checkProgress()
    return () => { cancelled = true }
  }, [currentChild, letterData])

  function fallbackServerTTS(text: string, type: 'letter' | 'word' | 'encourage') {
    setPlayingType(type)
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, speed: 0.7 }),
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
          setPlayingType(null)
          URL.revokeObjectURL(url)
        }
        audio.onerror = () => {
          setPlayingType(null)
          URL.revokeObjectURL(url)
        }
        audio.play()
      })
      .catch(() => {
        setPlayingType(null)
      })
  }

  function stopAudio() {
    stopBrowserSpeech()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingType(null)
  }

  const playTTS = useCallback(async (text: string, type: 'letter' | 'word' | 'encourage') => {
    if (!text) return
    stopAudio()
    try {
      setPlayingType(type)

      // Try browser TTS first (perfect Arabic)
      const usedBrowser = await speakWithBrowser(text, {
        speed: 0.8,
        onEnd: () => setPlayingType(null),
        onError: () => {
          // Fall back to server TTS
          setPlayingType(null)
          fallbackServerTTS(text, type)
        },
      })

      if (!usedBrowser) {
        setPlayingType(null)
        fallbackServerTTS(text, type)
      }
    } catch {
      setPlayingType(null)
    }
  }, [])

  useEffect(() => {
    return () => {
      stopBrowserSpeech()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  async function handleMarkLearned() {
    if (!currentChild || !letterData || isLearned) return
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: currentChild.id,
          type: 'letter',
          itemId: letterData.letter,
        }),
      })
      if (res.ok) {
        setIsLearned(true)
      }
    } catch {
      // Silently handle
    }
  }

  if (!currentChild || selectedLetter === null || !letterData) return null

  const vars = { name: currentChild.name, gender }

  return (
    <div className="min-h-screen bg-page-letters flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-sky-50/40 to-white/50" />
        {/* Decorative letters */}
        <div className="absolute top-20 left-6 text-6xl font-extrabold text-abood-secondary/8 animate-cloud-drift">أ ب ت</div>
        <div className="absolute top-40 right-8 text-5xl font-extrabold text-abood-sky/8 animate-cloud-drift" style={{ animationDelay: '2s' }}>ج ح خ</div>
        <div className="absolute bottom-40 left-10 text-5xl font-extrabold text-abood-accent/8 animate-cloud-drift" style={{ animationDelay: '4s' }}>د ذ ر</div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 p-8 flex flex-col items-center gap-7 max-w-lg mx-auto w-full"
      >
        {/* Header */}
        <div className="w-full flex items-center gap-4">
          <button
            onClick={() => setCurrentView('lettersList')}
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
          <h1 className="text-3xl font-extrabold text-foreground">{letterData.name}</h1>
          {isLearned && (
            <div className="mr-auto w-10 h-10 btn-secondary-premium rounded-full flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
        </div>

        {/* Giant Letter - tappable */}
        <motion.button
          onClick={() => {
            setTapped(true)
            playTTS(letterTTS, 'letter')
            setTimeout(() => setTapped(false), 1000)
          }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center w-56 h-56 rounded-3xl shadow-lg transition-all ${
            tapped
              ? 'bg-abood-primary/15'
              : 'glass-card'
          } ${playingType === 'letter' ? 'ring-4 ring-abood-primary/30 animate-soft-glow' : ''}`}
        >
          <span
            className={`text-[200px] font-extrabold leading-none ${
              tapped ? 'animate-letter-glow' : ''
            }`}
            style={{ color: '#FF9E6C' }}
          >
            {letterData.letter}
          </span>
        </motion.button>

        {/* Audio Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => playTTS(letterTTS, 'letter')}
            className={`audio-btn-lg bg-abood-primary text-white ${
              playingType === 'letter' ? 'ring-4 ring-abood-primary/30 scale-95' : ''
            } transition-transform`}
          >
            <span className="text-3xl">{playingType === 'letter' ? '🔊' : '🔉'}</span>
            <span className="text-xs font-bold leading-tight">اسمع الحرف</span>
          </button>
          <button
            onClick={() => playTTS(wordTTS, 'word')}
            className={`audio-btn-lg btn-accent-premium text-white ${
              playingType === 'word' ? 'ring-4 ring-abood-accent/30 scale-95' : ''
            } transition-transform`}
          >
            <span className="text-3xl">{playingType === 'word' ? '🗣️' : '💬'}</span>
            <span className="text-xs font-bold leading-tight">اسمع الكلمة</span>
          </button>
          <button
            onClick={() => playTTS(encourageTTS, 'encourage')}
            className={`audio-btn-lg btn-fun-premium text-white ${
              playingType === 'encourage' ? 'ring-4 ring-abood-fun/30 scale-95' : ''
            } transition-transform`}
          >
            <span className="text-3xl">{playingType === 'encourage' ? '🎉' : '🌟'}</span>
            <span className="text-xs font-bold leading-tight">تشجيع</span>
          </button>
        </div>

        {/* Playing indicator */}
        {playingType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 glass-card rounded-full px-6 py-3"
          >
            <div className="flex gap-1 items-end h-6">
              <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-1" />
              <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-2" />
              <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-3" />
              <div className="w-1.5 bg-abood-primary rounded-full animate-sound-bar-4" />
            </div>
            <span className="text-lg font-bold text-abood-primary">🔊 جاري التشغيل...</span>
          </motion.div>
        )}

        {/* Word Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card rounded-3xl p-8 flex flex-col items-center gap-3 w-full"
        >
          <span className="text-7xl">{letterData.wordImage}</span>
          <span className="text-3xl font-extrabold text-foreground">
            {letterData.letter} - {letterData.word}
          </span>
          <span className="text-xl text-muted-foreground">
            {letterData.name} ({letterData.pronunciation})
          </span>
        </motion.div>

        {/* Mark learned */}
        {!isLearned ? (
          <button
            onClick={handleMarkLearned}
            className="btn-secondary-premium w-full py-5 rounded-3xl text-2xl font-bold text-white min-h-[72px]"
          >
            ✅ تعلمت هذا الحرف!
          </button>
        ) : (
          <div className="w-full py-5 rounded-3xl text-2xl font-bold text-abood-secondary text-center bg-abood-secondary/10 border border-abood-secondary/20">
            🎉 {personalizeText('[good]! لقد [did] خيرًا يا [name]!', vars)}
          </div>
        )}
      </motion.div>
    </div>
  )
}

'use client'

// ===== Arabic TTS using Browser SpeechSynthesis API =====
// Uses native browser TTS for perfect Arabic pronunciation
// Falls back to server TTS if browser doesn't support Arabic

let arabicVoice: SpeechSynthesisVoice | null = null
let voicesLoaded = false

function findArabicVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null

  const voices = speechSynthesis.getVoices()

  // Priority 1: Arabic voices (ar-SA, ar-EG, ar-AE, etc.)
  for (const voice of voices) {
    if (voice.lang.startsWith('ar') && !voice.localService) {
      arabicVoice = voice
      return voice
    }
  }

  // Priority 2: Any Arabic voice (including local)
  for (const voice of voices) {
    if (voice.lang.startsWith('ar')) {
      arabicVoice = voice
      return voice
    }
  }

  return null
}

function loadVoices(): Promise<SpeechSynthesisVoice | null> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(null)
      return
    }

    const tryLoad = () => {
      const voice = findArabicVoice()
      if (voice) {
        voicesLoaded = true
        resolve(voice)
        return
      }
      if (voicesLoaded) {
        resolve(null)
        return
      }
      // Voices not loaded yet, wait
    }

    // Try immediately
    tryLoad()

    // Some browsers need event listener
    speechSynthesis.addEventListener('voiceschanged', () => {
      voicesLoaded = true
      const voice = findArabicVoice()
      resolve(voice)
    }, { once: true })

    // Timeout after 2 seconds
    setTimeout(() => {
      voicesLoaded = true
      resolve(findArabicVoice())
    }, 2000)
  })
}

// Speak text using browser TTS - returns true if successful
export async function speakWithBrowser(
  text: string,
  options: {
    speed?: number
    onEnd?: () => void
    onError?: () => void
  } = {}
): Promise<boolean> {
  const { speed = 0.85, onEnd, onError } = options

  try {
    if (!('speechSynthesis' in window)) return false

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    // Find Arabic voice
    let voice = arabicVoice
    if (!voice) {
      voice = await loadVoices()
    }
    if (!voice) return false

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    utterance.rate = speed
    utterance.pitch = 1.1 // Slightly higher pitch for kids
    utterance.volume = 1.0

    if (voice) {
      utterance.voice = voice
    }

    utterance.onend = () => {
      onEnd?.()
    }

    utterance.onerror = (event) => {
      // 'interrupted' is normal when we cancel speech
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        onError?.()
      }
    }

    speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

// Stop any ongoing browser speech
export function stopBrowserSpeech(): void {
  try {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  } catch {
    // Silently handle
  }
}

// Check if browser TTS has an Arabic voice available
export async function hasArabicVoice(): Promise<boolean> {
  try {
    if (!('speechSynthesis' in window)) return false
    const voice = arabicVoice ?? await loadVoices()
    return voice !== null
  } catch {
    return false
  }
}

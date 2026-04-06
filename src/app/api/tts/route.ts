import { NextRequest, NextResponse } from 'next/server'

// In-memory cache for TTS audio to avoid repeated API calls
const ttsCache = new Map<string, { buffer: Buffer; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Rate limiting: track last request time
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 800 // minimum 800ms between requests

// Pending request queue to serialize TTS calls
let pendingPromise: Promise<Buffer | null> | null = null

function getCacheKey(text: string, speed: number, voice: string): string {
  return `${voice}:${speed}:${text.slice(0, 200)}`
}

function getCachedAudio(key: string): Buffer | null {
  const entry = ttsCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    ttsCache.delete(key)
    return null
  }
  return entry.buffer
}

function setCachedAudio(key: string, buffer: Buffer): void {
  // Clean old entries if cache is too large (max 50 entries)
  if (ttsCache.size > 50) {
    const entries = Array.from(ttsCache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toDelete = entries.slice(0, entries.length - 40)
    for (const [k] of toDelete) {
      ttsCache.delete(k)
    }
  }
  ttsCache.set(key, { buffer, timestamp: Date.now() })
}

async function generateAudio(text: string, voice: string, speed: number): Promise<Buffer> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default
  const zai = await ZAI.create()

  const response = await zai.audio.tts.create({
    input: text,
    voice: voice,
    speed: speed,
    response_format: 'wav',
    stream: false,
  })

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(new Uint8Array(arrayBuffer))
}

async function throttledGenerate(text: string, voice: string, speed: number): Promise<Buffer> {
  // Serialize requests - wait for any pending request first
  if (pendingPromise) {
    await pendingPromise.catch(() => {})
  }

  // Rate limit: ensure minimum interval between requests
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  // Create promise for this request
  let resolvePromise: ((buffer: Buffer) => void) | null = null
  let rejectPromise: ((error: Error) => void) | null = null

  pendingPromise = new Promise<Buffer>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  lastRequestTime = Date.now()

  try {
    const buffer = await generateAudio(text, voice, speed)
    lastRequestTime = Date.now()
    pendingPromise = null
    resolvePromise!(buffer)
    return buffer
  } catch (error) {
    pendingPromise = null
    lastRequestTime = Date.now()
    if (rejectPromise) {
      rejectPromise(error instanceof Error ? error : new Error(String(error)))
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, speed = 0.8, voice = 'kazi' } = body

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const trimmedText = text.trim().slice(0, 1024)

    // Check cache first
    const cacheKey = getCacheKey(trimmedText, speed, voice)
    const cached = getCachedAudio(cacheKey)
    if (cached) {
      return new NextResponse(cached, {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': cached.length.toString(),
          'Cache-Control': 'public, max-age=86400',
          'X-Cache': 'HIT',
        },
      })
    }

    // Generate with rate limiting and retry
    let buffer: Buffer | null = null
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        buffer = await throttledGenerate(trimmedText, voice, speed)
        break
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error)

        // If rate limited, wait and retry
        if (errMsg.includes('429') && attempt < maxRetries) {
          const waitTime = 1500 * attempt // 1.5s, 3s, 4.5s
          console.warn(`TTS rate limited, retry ${attempt}/${maxRetries} after ${waitTime}ms`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }

        // Other errors - don't retry
        throw error
      }
    }

    if (!buffer) {
      return NextResponse.json({ error: 'Failed to generate audio after retries' }, { status: 500 })
    }

    // Cache the result
    setCachedAudio(cacheKey, buffer)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'MISS',
      },
    })
  } catch (error: unknown) {
    console.error('TTS error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate speech'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

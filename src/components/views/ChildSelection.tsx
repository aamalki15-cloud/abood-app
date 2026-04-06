'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { HeroAvatar } from '@/components/HeroAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const AVATAR_COLORS = [
  '#FF9E6C', '#6FCF97', '#B8A9E8', '#87CEEB',
  '#FF9EAD', '#FFD97D', '#9B8EC8', '#7EC8A0',
]

interface ChildData {
  id: string
  name: string
  gender: string
  avatarColor: string
}

export function ChildSelection() {
  const { setCurrentChild, setCurrentView } = useAppStore()
  const [children, setChildren] = useState<ChildData[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0])
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl'>('boy')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  // Fetch existing children
  useEffect(() => {
    async function fetchChildren() {
      try {
        const res = await fetch('/api/children')
        if (res.ok) {
          const data = await res.json()
          setChildren(data)
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false)
      }
    }
    fetchChildren()
  }, [])

  // Create new child
  async function handleCreateChild() {
    if (!newName.trim() || creating) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), avatarColor: selectedColor, gender: selectedGender }),
      })
      if (res.ok) {
        const child = await res.json()
        setChildren((prev) => [...prev, child])
        setNewName('')
        setSelectedColor(AVATAR_COLORS[0])
        setSelectedGender('boy')
        setDialogOpen(false)
        setCurrentChild({ id: child.id, name: child.name, gender: child.gender, avatarColor: child.avatarColor })
        setCurrentView('dashboard')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'حدث خطأ، حاول مرة أخرى')
      }
    } catch {
      setError('تعذر الاتصال بالخادم، تحقق من الإنترنت')
    } finally {
      setCreating(false)
    }
  }

  // Select child and navigate to dashboard
  function handleSelectChild(child: ChildData) {
    setCurrentChild({ id: child.id, name: child.name, gender: child.gender as 'boy' | 'girl', avatarColor: child.avatarColor })
    setCurrentView('dashboard')
  }

  return (
    <div className="min-h-screen bg-page-welcome flex flex-col items-center justify-center p-8 gap-10 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-abood-warning/20 animate-float-slow" />
      <div className="absolute top-24 right-12 w-10 h-10 rounded-full bg-abood-accent/20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-16 w-12 h-12 rounded-full bg-abood-secondary/20 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-20 w-8 h-8 rounded-full bg-abood-fun/25 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 left-4 text-3xl animate-twinkle" style={{ animationDelay: '0.3s' }}>✦</div>
      <div className="absolute top-1/4 right-6 text-2xl animate-twinkle" style={{ animationDelay: '1.2s' }}>✦</div>
      <div className="absolute bottom-1/3 left-10 text-2xl animate-twinkle" style={{ animationDelay: '0.8s' }}>✦</div>

      {/* Abood welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4 relative z-10"
      >
        <div className="animate-soft-glow rounded-full p-3">
          <HeroAvatar size="xl" variant="welcome" gender={selectedGender} animate />
        </div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold text-foreground"
        >
          مرحبًا! أنا {selectedGender === 'boy' ? 'عبود' : 'عسوله'} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-muted-foreground font-medium"
        >
          من أنت؟
        </motion.p>
      </motion.div>

      {/* Existing children */}
      {!loading && children.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-sm relative z-10"
        >
          {children.map((child, i) => (
            <motion.button
              key={child.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              onClick={() => handleSelectChild(child)}
              className="premium-card rounded-3xl p-7 flex items-center gap-6 transition-all"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0"
                style={{ backgroundColor: child.avatarColor }}
              >
                {child.name.charAt(0)}
              </div>
              <div className="flex-1 text-right">
                <span className="text-2xl font-bold text-foreground block">
                  أنا {child.name}
                </span>
                <span className="text-xl text-muted-foreground">
                  {child.gender === 'girl' ? '👧' : '👦'}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-6 h-6 border-3 border-abood-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xl">جاري التحميل...</span>
        </div>
      )}

      {/* Add new child button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm relative z-10"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-premium w-full h-20 text-2xl font-bold rounded-3xl text-white">
              إضافة طفل جديد ➕
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                من أنت؟ 💛
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-7 pt-4">
              {/* Name */}
              <div className="flex flex-col gap-3">
                <label className="text-2xl font-bold text-foreground">ما اسمك؟</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  className="h-16 text-2xl rounded-2xl text-center bg-white/80"
                  dir="rtl"
                  maxLength={20}
                />
              </div>
              {/* Gender */}
              <div className="flex flex-col gap-3">
                <label className="text-2xl font-bold text-foreground">ولد أم بنت؟</label>
                <div className="flex gap-5 justify-center">
                  <button
                    onClick={() => setSelectedGender('boy')}
                    className={`flex-1 h-28 rounded-3xl flex flex-col items-center justify-center gap-3 text-2xl font-bold transition-all shadow-md active:scale-95 ${
                      selectedGender === 'boy'
                        ? 'bg-blue-50 ring-4 ring-blue-400/50 text-blue-700 border-2 border-blue-200'
                        : 'bg-white text-gray-500 border-2 border-gray-100'
                    }`}
                  >
                    <span className="text-5xl">👦</span>
                    <span>ولد</span>
                  </button>
                  <button
                    onClick={() => setSelectedGender('girl')}
                    className={`flex-1 h-28 rounded-3xl flex flex-col items-center justify-center gap-3 text-2xl font-bold transition-all shadow-md active:scale-95 ${
                      selectedGender === 'girl'
                        ? 'bg-pink-50 ring-4 ring-pink-400/50 text-pink-700 border-2 border-pink-200'
                        : 'bg-white text-gray-500 border-2 border-gray-100'
                    }`}
                  >
                    <span className="text-5xl">👧</span>
                    <span>بنت</span>
                  </button>
                </div>
              </div>
              {/* Color */}
              <div className="flex flex-col gap-3">
                <label className="text-2xl font-bold text-foreground">اختر لونك 🎨</label>
                <div className="flex flex-wrap gap-4 justify-center">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-14 h-14 rounded-2xl transition-all active:scale-90 shadow-md"
                      style={{
                        backgroundColor: color,
                        outline: selectedColor === color ? '3px solid #3D3244' : 'none',
                        outlineOffset: '3px',
                        transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-500 rounded-2xl p-4 text-center text-xl font-bold border border-red-100">
                  {error}
                </div>
              )}
              {/* Submit */}
              <Button
                onClick={handleCreateChild}
                disabled={!newName.trim() || creating}
                className="btn-secondary-premium h-16 text-2xl font-bold rounded-2xl text-white disabled:opacity-50"
              >
                {creating ? '⏳ جاري الحفظ...' : 'يلا نبدأ! 🚀'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}

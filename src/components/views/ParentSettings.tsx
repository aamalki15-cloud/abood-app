'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const AVATAR_COLORS = [
  '#FF9F43', '#2ED573', '#A29BFE', '#48DBFB',
  '#FF6B81', '#FECA57', '#6C5CE7', '#00B894',
]

interface ChildData {
  id: string
  name: string
  gender: string
  avatarColor: string
}

export function ParentSettings() {
  const { setCurrentView, setCurrentChild, currentChild } = useAppStore()
  const [children, setChildren] = useState<ChildData[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl'>('boy')
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  const [resetChildId, setResetChildId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/children')
      .then((res) => {
        if (res.ok && !cancelled) return res.json()
      })
      .then((data) => {
        if (data && !cancelled) setChildren(data)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const [addingChild, setAddingChild] = useState(false)

  async function handleAddChild() {
    if (!newName.trim() || addingChild) return
    setAddingChild(true)
    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), avatarColor: selectedColor, gender: selectedGender }),
      })
      if (res.ok) {
        setNewName('')
        setSelectedColor(AVATAR_COLORS[0])
        setSelectedGender('boy')
        setAddDialogOpen(false)
        // Refresh children list
        const listRes = await fetch('/api/children')
        if (listRes.ok) {
          const data = await listRes.json()
          setChildren(data)
        }
      }
    } catch {
      // Silently handle
    } finally {
      setAddingChild(false)
    }
  }

  async function handleDeleteChild(id: string) {
    try {
      const res = await fetch(`/api/children/${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Refresh children list
        fetch('/api/children')
          .then((r) => r.ok ? r.json() : null)
          .then((data) => { if (data) setChildren(data) })
          .catch(() => {})
        if (currentChild?.id === id) {
          setCurrentChild(null)
          setCurrentView('childSelection')
        }
      }
    } catch {
      // Silently handle
    }
    setDeleteId(null)
  }

  async function handleResetProgress(childId: string) {
    try {
      await fetch(`/api/progress`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId }),
      })
    } catch {
      // Silently handle
    }
    setResetChildId(null)
    setResetConfirmOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-6 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="touch-target-sm p-2 rounded-full bg-white shadow-md active:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <h1 className="text-2xl font-extrabold text-foreground">⚙️ إعدادات الوالدين</h1>
      </div>

      {/* Parent verification notice */}
      <div className="bg-abood-warning/20 rounded-xl p-4 text-center">
        <p className="text-lg font-bold text-foreground">🔒 هذه الصفحة للوالدين فقط</p>
      </div>

      {/* Children list */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-foreground">👥 الأطفال</h2>
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
              style={{ backgroundColor: child.avatarColor }}
            >
              {child.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-foreground">
                {child.name} {child.gender === 'girl' ? '👧' : '👦'}
              </p>
              {currentChild?.id === child.id && (
                <span className="text-sm text-abood-secondary font-medium">مستخدم حاليًا</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setResetChildId(child.id)
                  setResetConfirmOpen(true)
                }}
                className="touch-target-sm p-2 rounded-lg bg-abood-warning/20 text-abood-warning active:bg-abood-warning/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>
              <AlertDialog open={deleteId === child.id} onOpenChange={(open) => setDeleteId(open ? child.id : null)}>
                <AlertDialogTrigger asChild>
                  <button className="touch-target-sm p-2 rounded-lg bg-destructive/20 text-destructive active:bg-destructive/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">حذف الطفل</AlertDialogTitle>
                    <AlertDialogDescription className="text-lg">
                      هل أنت متأكد من حذف {child.name}؟ سيتم حذف جميع التقدم المحفوظ.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="text-lg">إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteChild(child.id)}
                      className="bg-destructive text-lg"
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {/* Add child */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full h-14 text-xl font-bold rounded-xl bg-abood-primary hover:bg-abood-primary/90 text-white"
          >
            ➕ إضافة طفل جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">إضافة طفل جديد 💛</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-foreground">اسم الطفل</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="اكتب الاسم هنا..."
                className="h-14 text-xl rounded-xl text-center"
                dir="rtl"
                maxLength={20}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-foreground">الجنس</label>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedGender('boy')}
                  className={`flex-1 h-16 rounded-xl flex items-center justify-center gap-2 text-lg font-bold transition-all shadow-md active:scale-95 ${
                    selectedGender === 'boy'
                      ? 'bg-blue-50 ring-3 ring-blue-400 text-blue-700'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  👦 ولد
                </button>
                <button
                  onClick={() => setSelectedGender('girl')}
                  className={`flex-1 h-16 rounded-xl flex items-center justify-center gap-2 text-lg font-bold transition-all shadow-md active:scale-95 ${
                    selectedGender === 'girl'
                      ? 'bg-pink-50 ring-3 ring-pink-400 text-pink-700'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  👧 بنت
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-foreground">اللون</label>
              <div className="flex flex-wrap gap-3 justify-center">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="w-12 h-12 rounded-full transition-transform active:scale-90 shadow-md"
                    style={{
                      backgroundColor: color,
                      outline: selectedColor === color ? '3px solid #2D3436' : 'none',
                      outlineOffset: '3px',
                    }}
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddChild}
              disabled={!newName.trim() || addingChild}
              className="h-14 text-xl font-bold rounded-xl bg-abood-secondary hover:bg-abood-secondary/90 text-white"
            >
              {addingChild ? '⏳ جاري الحفظ...' : 'إضافة ✅'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset progress dialog */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">إعادة تعيين التقدم</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              هل أنت متأكد؟ سيتم حذف جميع التقدم التعليمي لهذا الطفل.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-lg">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetChildId && handleResetProgress(resetChildId)}
              className="bg-abood-warning text-lg text-foreground"
            >
              إعادة تعيين
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Switch child button */}
      <Button
        onClick={() => setCurrentView('childSelection')}
        variant="outline"
        className="w-full h-14 text-xl font-bold rounded-xl"
      >
        🔄 تغيير المستخدم
      </Button>
    </motion.div>
  )
}

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ChildSelection } from '@/components/views/ChildSelection'
import { Dashboard } from '@/components/views/Dashboard'
import { StoriesList } from '@/components/views/StoriesList'
import { StoryReader } from '@/components/views/StoryReader'
import { ColoringList } from '@/components/views/ColoringList'
import { LettersList } from '@/components/views/LettersList'
import { LetterDetail } from '@/components/views/LetterDetail'
import { ParentSettings } from '@/components/views/ParentSettings'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}

export default function Home() {
  const { currentView, selectedStory, selectedLetter } = useAppStore()

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {currentView === 'childSelection' && <ChildSelection />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'storiesList' && <StoriesList />}
          {currentView === 'storyReader' && <StoryReader key={selectedStory ?? 'none'} />}
          {currentView === 'coloringList' && <ColoringList />}
          {currentView === 'lettersList' && <LettersList />}
          {currentView === 'letterDetail' && <LetterDetail key={selectedLetter ?? 'none'} />}
          {currentView === 'parentSettings' && <ParentSettings />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

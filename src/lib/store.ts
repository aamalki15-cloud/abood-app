import { create } from 'zustand'

export type ViewType =
  | 'childSelection'
  | 'dashboard'
  | 'storiesList'
  | 'storyReader'
  | 'coloringList'
  | 'lettersList'
  | 'letterDetail'
  | 'parentSettings'

interface CurrentChild {
  id: string
  name: string
  gender: 'boy' | 'girl'
  avatarColor: string
}

interface AppState {
  currentView: ViewType
  currentChild: CurrentChild | null
  selectedStory: number | null
  selectedLetter: number | null
  setCurrentView: (view: ViewType) => void
  setCurrentChild: (child: CurrentChild | null) => void
  setSelectedStory: (index: number | null) => void
  setSelectedLetter: (index: number | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'childSelection',
  currentChild: null,
  selectedStory: null,
  selectedLetter: null,
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentChild: (child) => set({ currentChild: child }),
  setSelectedStory: (index) => set({ selectedStory: index }),
  setSelectedLetter: (index) => set({ selectedLetter: index }),
}))

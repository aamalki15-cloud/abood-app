---
## Task ID: 1 - Full-Stack Developer
### Work Task
Build a complete interactive Arabic children's educational website called "عبود" (Abood) - a single-page app with 8 views managed by Zustand state.

### Work Summary
Successfully built the entire "عبود" (Abood) children's educational platform from scratch. The application is a comprehensive single-page app with the following components:

#### Files Created

**Core Data & State:**
- `src/lib/store.ts` - Zustand store managing currentView, currentChild, selectedStory, selectedLetter
- `src/lib/data.ts` - Complete data: 4 stories (each with 4 pages), 28 Arabic letters with emojis/words, 8 coloring pages, encouragement phrases, and utility functions

**Layout & Styling:**
- `src/app/layout.tsx` - RTL Arabic layout with Tajawal font (400/500/700/800), warm cream background (#FFF9F0)
- `src/app/globals.css` - Complete custom Tailwind theme with pastel color palette, custom animations (abood-bounce, float, sparkle, letter-glow), speech bubble styling, custom scrollbar, touch-target utilities, RTL optimizations

**Reusable Components:**
- `src/components/AboodAvatar.tsx` - Reusable avatar with 5 variants (main/welcome/reading/coloring/letters), 4 sizes, float animation
- `src/components/AboodBubble.tsx` - Speech bubble with personalization ([name] replacement)

**View Components (8 views):**
- `src/components/views/ChildSelection.tsx` - Welcome screen with Abood, child grid, add-child dialog with name input + color picker
- `src/components/views/Dashboard.tsx` - Greeting bar, 3 main section cards (Stories/Coloring/Letters), daily suggestions (random story/letter/coloring), settings icon
- `src/components/views/StoriesList.tsx` - Story cards grid with covers, titles, descriptions, read buttons
- `src/components/views/StoryReader.tsx` - Page-by-page reader with illustrations, text, TTS playback, navigation dots, encouragement phrases, mark-as-completed
- `src/components/views/ColoringList.tsx` - Coloring page grid with full-image preview dialog
- `src/components/views/LettersList.tsx` - 28-letter grid (4-5 per row) with learned checkmarks, progress bar
- `src/components/views/LetterDetail.tsx` - Giant letter display (140px), word+emoji, TTS, tap-to-hear activity, mark-as-learned
- `src/components/views/ParentSettings.tsx` - Parent-only settings: child list with edit/delete, add child, reset progress, switch user

**API Routes:**
- `src/app/api/children/route.ts` - GET (list children), POST (create child)
- `src/app/api/children/[id]/route.ts` - GET (single child), DELETE (child + cascade)
- `src/app/api/progress/route.ts` - GET (progress by childId), POST (upsert letter/story progress), DELETE (reset all progress)
- `src/app/api/tts/route.ts` - POST (generate TTS audio using z-ai-web-dev-sdk with tongtong voice, speed 0.8)

**Generated Images (16 AI-generated images):**
- Abood character: main.png, welcome.png, reading.png, coloring.png, letters.png
- Story illustrations: sharing.png, gratitude.png, honesty.png, kindness.png
- Coloring pages: lion.png, apple.png, house.png, moon-stars.png, bus.png, fish.png, butterfly.png
- Letter illustrations: alif.png, baa.png, taa.png

**Main Page:**
- `src/app/page.tsx` - AnimatePresence with fade/slide transitions between views, key-based remounting for StoryReader and LetterDetail

#### Key Design Decisions
- Used `useMemo` for daily suggestions in Dashboard (avoided setState-in-effect lint error)
- Used `key` prop on StoryReader/LetterDetail for clean state reset on story/letter change
- Used promise chains (not async/await in effects) for ParentSettings data fetching
- Added cleanup with `cancelled` flag in async effects to prevent stale setState
- All text in Arabic, all code comments in English
- Touch-first design (64px min targets, no hover dependencies)
- Warm pastel palette: orange (#FF9F43), green (#2ED573), purple (#A29BFE), yellow (#FECA57), pink (#FF6B81), sky blue (#48DBFB)
- Framer Motion for gentle page transitions and staggered list animations
- TTS API fixed to use correct z-ai-web-dev-sdk API: `zai.audio.tts.create()`

#### Lint Status
All lint errors resolved. Final lint passes cleanly with 0 errors, 0 warnings. Dev server compiles successfully and serves the application.

#### Database Schema
- Child: id, name, avatarColor, createdAt
- LetterProgress: id, childId, letter, completed (unique on childId+letter)
- StoryProgress: id, childId, storyId, completed (unique on childId+storyId)
- Cascade delete on child removal

---
## Task ID: 2 - Full-Stack Update (Gender System, Characters, Personalization)
### Work Task
Major update to the "عبود" (Abood) children's educational platform: add gender-aware personalization, character system with 7 friends of Abood, rewrite all stories with characters and gender placeholders, update all views to be gender-aware, add TTS auto-play, and add character-themed coloring pages.

### Work Summary

#### Files Modified (13 files)

**1. `src/lib/store.ts`**
- Added `gender: 'boy' | 'girl'` field to `CurrentChild` interface

**2. `src/lib/data.ts` - Complete Rewrite**
- **Character System**: 7 characters defined with `Character` interface (id, name, type, emoji, trait, color, image, description)
  - سامي (Sami - Lion): courage & kindness 🦁
  - زبدة (Zobda - Rabbit): honesty & purity 🐰
  - ميمي (Mimi - Cat): politeness & playfulness 🐱
  - بسبوس (Bobsos - Bear): cooperation & caring 🐻
  - بلبل (Bulbul - Bird): helpfulness & kindness 🐦
  - نورة (Noora - Star): gratitude & optimism ⭐
  - لولو (Lolo - Turtle): wisdom & patience 🐢
- **Gender-Aware Personalization**: `personalizeText(text, vars)` replaces 11 placeholders: `[name]`, `[hero]`, `[hero2]`, `[ready]`, `[happy]`, `[proud]`, `[smart]`, `[good]`, `[did]`, `[you_are]`, `[are_you]`, `[come]`
- **Gender-Aware Encouragement**: `getEncouragement(gender)` returns shared + gender-specific phrases
- **4 Rewritten Stories** using character names and gender placeholders:
  - "سامي يشارك" (Sami Shares) - characters: Sami + Zobda
  - "بلبل يقول شكرًا" (Bulbul Says Thank You) - characters: Bulbul + Noora
  - "زبدة الصادقة" (Honest Zobda) - characters: Zobda + Lolo
  - "ميمي تساعد لولو" (Mimi Helps Lolo) - characters: Mimi + Lolo
- **11 Coloring Pages** with `characterId` field linking to characters (7 character + 4 generic)
- Added `getCharacter(id)` helper and `characterIds` field to stories

**3. `src/app/api/children/route.ts`**
- POST endpoint now accepts `gender` field and stores it (defaults to 'boy')

**4. `src/components/AboodBubble.tsx`**
- Added `gender?: 'boy' | 'girl'` prop
- Uses `personalizeText` with full gender vars when both childName and gender are provided
- Falls back to simple [name] replacement when only childName is given

**5. `src/components/views/ChildSelection.tsx`**
- Added gender selection with 2 large touch-friendly buttons (👦 Boy / 👧 Girl)
- Gender buttons have visual feedback (ring highlight, background color change)
- Sends `gender` along with name and avatarColor when creating child
- Existing children show gender emoji badge

**6. `src/components/views/Dashboard.tsx`**
- Gender-aware AboodBubble message with different text for boys/girls
- Added "Meet the Friends" section with horizontal scrollable character cards
- Added daily encouragement card (gender-aware)
- Uses `personalizeText` with full gender vars

**7. `src/components/views/StoriesList.tsx`**
- Shows character badges on each story card (colored badges with emoji + name)
- Gender-aware AboodBubble greeting

**8. `src/components/views/StoryReader.tsx`**
- **Auto-play TTS** when entering a new page (deferred 300ms via setTimeout)
- Added loading/playing indicators (animated sound bars, spinner)
- Gender-aware encouragement text
- Manual play/pause button preserved
- Proper cleanup on page change and unmount

**9. `src/components/views/ColoringList.tsx`**
- Character badges on coloring pages that feature characters (emoji badge + name tag)
- Gender-aware AboodBubble and descriptions using `personalizeText`

**10. `src/components/views/LettersList.tsx`**
- Gender-aware AboodBubble greeting using `[you_are]`, `[smart]` placeholders

**11. `src/components/views/LetterDetail.tsx`**
- Gender-aware AboodBubble: `[good] يا [hero] يا [name]!`
- Gender-aware learned message: `[good]! لقد [did] خيرًا يا [name]!`

**12. `src/components/views/ParentSettings.tsx`**
- Added gender selection in add-child dialog (same boy/girl buttons)
- Shows gender emoji next to child names in the list
- Sends gender when creating new child

**13. `src/app/api/tts/route.ts`** - Kept unchanged (already working)

#### Generated Images
- 7 character images in `/public/images/characters/`:
  - sami-lion.png, zobda-rabbit.png, mimi-cat.png, bobsos-bear.png, bulbul-bird.png, noora-star.png, lolo-turtle.png

#### Key Design Decisions
- Used `setTimeout(300ms)` for TTS auto-play to satisfy React Compiler rules (avoid sync setState in effects)
- Used `autoPlayRef` to prevent TTS re-triggering on unrelated re-renders
- Defined `stopAudio` and `triggerTTS` before effects to satisfy React Compiler variable ordering rules
- Used promise chains (not async/await) in `triggerTTS` to avoid async issues in timeout callback
- Gender-aware system covers Arabic grammar differences (e.g., أنتَ/أنتِ, أحسنت/أحسنتِ, بطل/بطلة)
- Prisma schema already had `gender` field with default "boy"

#### Lint Status
All lint errors resolved. Final `npm run lint` passes cleanly with 0 errors, 0 warnings.

---
## Task ID: 3 - UX Redesign (Child-Friendly iPad Optimization)
### Work Task
Complete UX redesign of the "عبود" (Abood) children's educational app for kids aged 3-7 on iPad. Fix critical issues: cluttered UI, text too long, touch targets too small, audio not prominent enough.

### Work Summary

#### Design Principles Applied
1. **SIMPLICITY** - Maximum 3 elements per screen requiring action
2. **HUGE TOUCH TARGETS** - Minimum 72px (`big-touch` class), audio buttons 96-112px
3. **GIANT TEXT** - text-3xl for headings, text-2xl for body, text-xl minimum
4. **LESS TEXT** - Maximum 1-2 short sentences per section
5. **AUDIO IS PRIMARY** - Audio buttons are the most prominent elements
6. **WHITE SPACE** - p-8 padding, gap-8 spacing throughout
7. **ONE ACTION AT A TIME** - Step-by-step guidance
8. **NO CLUTTER** - Removed daily suggestions, meet-the-friends section, visible settings gear

#### Files Modified (8 files)

**1. `src/app/globals.css`**
- Added `.big-touch` utility class (min-height: 72px, min-width: 72px)
- Added `.audio-btn` (96px round buttons with shadow) and `.audio-btn-lg` (112px variant)
- Added sound bar animation classes (`.animate-sound-bar-1` through `.animate-sound-bar-4`) with custom keyframes for audio playing indicators

**2. `src/components/views/Dashboard.tsx` - COMPLETE REWRITE**
- Removed: daily suggestions section, meet-the-friends section, visible settings gear icon, description text on cards, all imports for stories/letters/coloringPages/characters/getEncouragement
- Simplified to: greeting with avatar + name, one AboodBubble message, 3 huge vertical cards
- Cards: full width, min-h-[128px], rounded-3xl, p-8, text-3xl titles, text-xl subtitles
- Hidden parent settings: triple-tap on Abood's avatar (800ms timeout window) triggers navigation to parentSettings view
- `max-w-lg mx-auto` for centered content on iPad

**3. `src/components/views/LettersList.tsx` - SIMPLIFIED**
- Title changed to "✏️ الحروف العربية" (text-3xl)
- AboodBubble simplified to "هيا نتعلم يا [name]!"
- Progress bar enlarged: h-4, p-6, text-xl count
- Grid: 4 columns, min-h-[96px] cells, rounded-2xl, gap-4
- Removed word text from cells - only shows big letter (text-4xl) + emoji (text-2xl)
- Checkmarks: w-7 h-7 with thicker ring-3

**4. `src/components/views/LetterDetail.tsx` - MAJOR REDESIGN**
- **Section 1**: Back button (big-touch) + letter name (text-3xl) + learned checkmark
- **Section 2**: GIANT letter display - text-[200px] in w-56 h-56 card, tappable with letter-glow animation, ring-4 when playing
- **Section 3**: THREE BIG AUDIO BUTTONS (primary interaction):
  - 🔊 "اسمع الحرف" - audio-btn-lg, bg-abood-primary (plays letter name + sound)
  - 🗣️ "اسمع الكلمة" - audio-btn-lg, bg-abood-accent (plays word + emoji)
  - 🎉 "تشجيع" - audio-btn-lg, bg-abood-fun (plays random encouragement)
  - Each button has: emoji (text-3xl) on top, label (text-xs) below, scale feedback when active
- Playing indicator: animated sound bars + "🔊 جاري التشغيل..." text
- **Section 4**: Word display card: emoji (text-7xl), word (text-3xl), pronunciation (text-xl)
- **Section 5**: Activity card: "👆 اضغط على الحرف واسمعه!" (text-2xl)
- **Section 6**: Full-width mark-as-learned button (py-6, text-2xl, min-h-[72px], rounded-3xl)
- Separate TTS functions for letter/word/encouragement with different `playingType` states

**5. `src/components/views/StoriesList.tsx` - SIMPLIFIED**
- Title: "📚 القصص" (text-3xl)
- AboodBubble: "هيا نقرأ يا [name]!"
- Cards: single column (full width), h-48 cover images, text-2xl titles
- Removed description text from cards
- Character badges: larger (px-3 py-1, text-base, rounded-full)
- Big "📖 استمع" button at bottom of each card (text-2xl, min-h-[72px])

**6. `src/components/views/StoryReader.tsx` - MAJOR REDESIGN**
- **PROMINENT Audio Control Bar** at top (after title): play/pause button (w-16 h-16, rounded-full), "🔊 استمع للقصة" label (text-2xl), page indicator "1/4"
- Animated sound bars visible during playback
- Illustration area: h-64 (larger)
- Story text: text-2xl (up from text-xl), p-8, rounded-3xl
- Removed page dots (too small) - replaced with "1/4" text in audio bar
- Navigation: full-width half-screen buttons (flex-1, py-6, text-2xl, min-h-[72px], rounded-3xl)
- **Auto-play TTS**: fires 500ms after page change (up from 300ms)
- **Auto-advance**: after TTS ends, waits 2 seconds then auto-advances to next page
- Manual navigation cancels auto-advance
- Last page celebration: large emoji, personalized encouragement (text-3xl), back button
- Stable encouragement via `useState` (avoids ref-during-render lint error)

**7. `src/components/views/ChildSelection.tsx` - SIMPLIFIED**
- Welcome text simplified: "من أنت؟" (was "من أنت يا صغيري؟")
- Existing children: single column (was 2-col grid), bigger cards (p-8), text-2xl names
- Add child dialog: h-20 button (was h-16), text-2xl, rounded-3xl
- Gender buttons: h-28 (was h-20), text-5xl emojis, text-2xl labels, ring-4 selection
- Name input: h-16, text-2xl, rounded-2xl
- Color picker: w-14 h-14, outline-4px
- Submit button: h-16, text-2xl

**8. `src/components/views/ColoringList.tsx` - SIMPLIFIED**
- Cards: single column (was 2-col grid), h-40 images, rounded-3xl
- Removed description text from card grid view
- Character badges: w-10 h-10 (was w-8 h-8), text-xl
- Title in card: text-2xl (was text-lg), p-6
- Dialog: shows description only when opened (text-xl)
- Dialog button: py-5, text-2xl, min-h-[72px], rounded-3xl

**9. `src/components/views/ParentSettings.tsx` - KEPT UNCHANGED**

**10. `src/components/AboodBubble.tsx` - KEPT UNCHANGED**

**11. `src/components/AboodAvatar.tsx` - KEPT UNCHANGED**

**12. `src/lib/store.ts` - KEPT UNCHANGED**

**13. `src/lib/data.ts` - KEPT UNCHANGED**

#### Key Design Decisions
- Used `max-w-lg mx-auto` on all views for centered iPad-friendly layout
- All rounded corners upgraded to `rounded-3xl` (from rounded-2xl)
- Hidden parent settings via triple-tap gesture (800ms timeout) instead of visible gear icon
- Audio buttons as `audio-btn-lg` (112px round) are the visual focal point of LetterDetail
- Sound bar animations use custom CSS keyframes for smooth audio playback indication
- Auto-advance in StoryReader uses a separate `autoAdvanceTimerRef` properly cleaned up on stop/unmount
- Used `useState` initializer pattern for stable encouragement text to avoid ref-during-render lint error

#### Lint Status
All lint errors resolved. Final `npm run lint` passes cleanly with 0 errors, 0 warnings.

---
## Task ID: 4 - TTS Fixes (Voice, Repetition, Story Reading)
### Work Task
Fix multiple TTS issues: (1) Chinese voice already fixed to Arabic `kazi`, (2) letter TTS repeating too much, (3) story TTS reading entire page at once instead of sentence by sentence.

### Work Summary

#### Issues Fixed

**1. Letter TTS Repetition**
- Old `getLetterTTS()`: `حرف ألف. ألف. كلمة: أسد. أسد` (letter name said 3 times, word said 2 times)
- New `getLetterTTS()`: `حرف ألف. أسد` (concise and clear)
- Old `getWordTTS()`: `الكلمة هي: أسد. أسد. ألف أسد` (word said 2 times)
- New `getWordTTS()`: `أسد` (just the word, clean and simple)

**2. Story TTS - Sentence-by-Sentence Reading**
- Rewrote `StoryReader.tsx` to split page text into sentences using `splitIntoSentences()` function
- Splits on Arabic/English sentence-ending punctuation (. ! ؟)
- Plays each sentence sequentially with 600ms pause between sentences
- Added sentence highlighting: current sentence in primary color/bold, completed sentences in muted color
- Uses `cancelledRef` pattern for clean cancellation when stopping or navigating away
- After all sentences complete, auto-advances to next page after 2.5s delay

**3. Browser TTS as Primary with Server Fallback**
- Each sentence first tries browser TTS (`speakWithBrowser`)
- Falls back to server TTS (`/api/tts` with `kazi` voice) if browser TTS unavailable
- Sequential sentence-by-sentence playback for both browser and server TTS

#### Files Modified
- `src/lib/data.ts` - Simplified `getLetterTTS()` and `getWordTTS()` to remove excessive repetition
- `src/components/views/StoryReader.tsx` - Complete rewrite of TTS playback: sentence splitting, sequential playback with highlighting, proper cancellation

#### Lint Status
All lint errors resolved. Final `bun run lint` passes cleanly with 0 errors, 0 warnings.

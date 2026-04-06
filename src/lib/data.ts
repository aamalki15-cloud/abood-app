// ===== Character System =====
export interface Character {
  id: string
  name: string
  type: string
  emoji: string
  trait: string
  color: string
  image: string
  description: string
}

export const characters: Character[] = [
  { id: 'sami', name: 'سامي', type: 'أسد', emoji: '🦁', trait: 'الشجاعة واللطف', color: '#FF9F43', image: '/images/characters/sami-lion.png', description: 'أسد صغير شجاع ولطيف' },
  { id: 'zobda', name: 'زبدة', type: 'أرنب', emoji: '🐰', trait: 'الصدق والنقاء', color: '#FF6B81', image: '/images/characters/zobda-rabbit.png', description: 'أرنب صغير صادق ونقي' },
  { id: 'mimi', name: 'ميمي', type: 'قطة', emoji: '🐱', trait: 'الأدب والمرح', color: '#A29BFE', image: '/images/characters/mimi-cat.png', description: 'قطة صغيرة مؤدبة ومرحة' },
  { id: 'bobsos', name: 'بسبوس', type: 'دب', emoji: '🐻', trait: 'التعاون والحنان', color: '#D4915C', image: '/images/characters/bobsos-bear.png', description: 'دب صغير حنون ومتعاون' },
  { id: 'bulbul', name: 'بلبل', type: 'عصفور', emoji: '🐦', trait: 'المساعدة والطيبة', color: '#FECA57', image: '/images/characters/bulbul-bird.png', description: 'عصفور صغير طيب ومساعد' },
  { id: 'noora', name: 'نورة', type: 'نجمة', emoji: '⭐', trait: 'الامتنان والتفاؤل', color: '#F9CA24', image: '/images/characters/noora-star.png', description: 'نجمة صغيرة متفائلة ممتنة' },
  { id: 'lolo', name: 'لولو', type: 'سلحفاة', emoji: '🐢', trait: 'الحكمة والصبر', color: '#2ED573', image: '/images/characters/lolo-turtle.png', description: 'سلحفاة صغيرة ذكية وصبورة' },
]

// Helper to get character by id
export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id)
}

// ===== Gender-Aware Personalization System =====
export type ChildGender = 'boy' | 'girl'

export interface PersonalizationVars {
  name: string
  gender: ChildGender
}

// Get guide name based on child gender
export function getGuideName(gender: ChildGender): string {
  return gender === 'boy' ? 'عبود' : 'عسوله'
}

// Replaces [name], [hero], [guide], [ready], [happy], [proud], [smart] placeholders
export function personalizeText(text: string, vars: PersonalizationVars): string {
  const isBoy = vars.gender === 'boy'
  const guide = getGuideName(vars.gender)
  return text
    .replace(/\[name\]/g, vars.name)
    .replace(/\[guide\]/g, guide)
    .replace(/\[hero\]/g, isBoy ? 'بطل' : 'بطلة')
    .replace(/\[hero2\]/g, isBoy ? 'بطل' : 'بطلة')
    .replace(/\[ready\]/g, isBoy ? 'جاهز' : 'جاهزة')
    .replace(/\[happy\]/g, isBoy ? 'سعيد' : 'سعيدة')
    .replace(/\[proud\]/g, isBoy ? 'فخور' : 'فخورة')
    .replace(/\[smart\]/g, isBoy ? 'ذكي' : 'ذكية')
    .replace(/\[good\]/g, isBoy ? 'أحسنت' : 'أحسنتِ')
    .replace(/\[did\]/g, isBoy ? 'فعلت' : 'فعلتِ')
    .replace(/\[you_are\]/g, isBoy ? 'أنتَ' : 'أنتِ')
    .replace(/\[are_you\]/g, isBoy ? 'هل أنتَ' : 'هل أنتِ')
    .replace(/\[come\]/g, isBoy ? 'تعالَ' : 'تعالي')
}

// ===== Gender-Aware Encouragement =====
export function getEncouragement(gender: ChildGender): string[] {
  const shared = ['رائع جدًا! 🌟', 'ممتاز! 🎉', 'ما شاء الله! ⭐', 'جميل جدًا! 🌈', 'عظيم! 🏆']
  const genderSpecific = gender === 'boy'
    ? ['أحسنت يا بطل! 💪', 'أنت بطل حقيقي! 🦁', 'استمر يا بطل! 🚀', 'أنت شجاع يا [name]! 🌟']
    : ['أحسنتِ يا بطلة! 💪', 'أنتِ بطلة حقيقية! 🌸', 'استمري يا بطلة! 🚀', 'أنتِ شجاعة يا [name]! 🌟']
  return [...shared, ...genderSpecific]
}

// ===== Story Data =====
export interface StoryPage {
  text: string
  image?: string
}

export interface Story {
  id: string
  title: string
  description: string
  moral: string
  color: string
  image: string
  characterIds: string[]
  pages: StoryPage[]
}

export const stories: Story[] = [
  {
    id: 'sharing',
    title: 'سامي يشارك',
    description: 'قصة سامي الأسد عن المشاركة مع الأصدقاء',
    moral: 'المشاركة تجعلنا أسعد!',
    color: '#FF9F43',
    image: '/images/stories/sharing.png',
    characterIds: ['sami', 'zobda'],
    pages: [
      {
        text: 'كان يا ما كان، في غابة جميلة، أسد صغير اسمه سامي 🦁. كان سامي يحب ألعابه كثيرًا ولا يريد أن يشاركها مع أحد. كان يجلس وحيدًا ويلعب',
        image: '/images/stories/sharing.png',
      },
      {
        text: 'ذات يوم، جاءت زبدة الأرنب الصغيرة 🐰 وقالت لسامي: "هل يمكنني أن ألعب معك يا سامي؟" لكن سامي قال: "لا! هذه ألعابي فقط!" فحزنت زبدة كثيرًا وذهبت بعيدًا',
      },
      {
        text: 'قال [guide] لسامي: "يا سامي، [are_you] [happy] وأنت تلعب وحيدًا؟ المشاركة تجعل اللعب أكثر متعة! أنا أعرف أن [name] يحب أن يشارك ألعابه مع الأصدقاء، فهل تفعل مثل [name]؟"',
      },
      {
        text: 'فكر سامي وقال: "أنتِ محقة يا [guide]!" فذهب سامي إلى زبدة وقال: "تعالي نلعب معًا يا زبدة!" لعبا طوال اليوم وكانا سعيدين جدًا! قالت [guide]: "[good] يا [name]! [you_are] [smart] جدًا لأنك تعرف أن المشاركة أجمل شيء!"',
      },
    ],
  },
  {
    id: 'gratitude',
    title: 'بلبل يقول شكرًا',
    description: 'قصة بلبل العصفور عن شكر الآخرين',
    moral: 'قول شكرًا يجعل الجميع سعداء!',
    color: '#2ED573',
    image: '/images/stories/gratitude.png',
    characterIds: ['bulbul', 'noora'],
    pages: [
      {
        text: 'في حديقة جميلة، كان هناك عصفور صغير اسمه بلبل 🐦. كان بلبل يحب أن يساعده الجميع لكنه كان ينسى أن يقول شكرًا. كانت نورة النجمة ⭐ تلاحظ ذلك دائمًا',
        image: '/images/stories/gratitude.png',
      },
      {
        text: 'ذات يوم، بنى بلبل عشًا جديدًا وساعدته نورة بإضاءة الطريق له. فرح بلبل جدًا بنشئته الجديدة لكنه نسى أن يقول شكرًا لنورة. فحزنت نورة قليلًا لأنها لم تسمع كلمة شكر',
      },
      {
        text: 'قالت [guide] لبلبل: "يا بلبل، هل تعلم يا [name] أن كلمة شكرًا سحرية؟ عندما تقولها، تجعل الشخص الآخر [happy] جدًا! نورة ساعدتِك كثيرًا، فلماذا لا تقول لها شكرًا؟"',
      },
      {
        text: 'قال بلبل لنورة: "شكرًا يا نورة! أنتِ نجمة رائعة!" وأضاءت نورة أكثر من أي وقت مضى! منذ ذلك اليوم، كان بلبل يقول شكرًا دائمًا! قالت [guide]: "[good] يا [name]! [you_are] [proud] لأنك تقول شكرًا دائمًا!"',
      },
    ],
  },
  {
    id: 'honesty',
    title: 'زبدة الصادقة',
    description: 'قصة زبدة الأرنب عن الصدق وقول الحقيقة',
    moral: 'الصدق أحسن وأجمل!',
    color: '#48DBFB',
    image: '/images/stories/honesty.png',
    characterIds: ['zobda', 'lolo'],
    pages: [
      {
        text: 'كانت هناك أرنب صغيرة اسمها زبدة 🐰. كانت زبدة تلعب في الحديقة وكسرت زهرة لولو السلحفاة بالخطأ 🐢. خافت زبدة كثيرًا ولم تعرف ماذا تفعل!',
        image: '/images/stories/honesty.png',
      },
      {
        text: 'عندما جاءت لولو، سألت زبدة: "من كسر زهرتي الجميلة؟" فقالت زبدة: "الرياح فعلت ذلك!" لكنها شعرت بضيق كبير في قلبها لأنها لم تقول الحقيقة',
      },
      {
        text: 'قالت [guide] لزبدة: "يا زبدة، الصدق مهم جدًا. [you_are] تعلمين أن عندما نقول الحقيقة نشعر بالراحة. [name] أيضًا يعرف أن الصدق أفضل دائمًا. دعينا نخبر لولو بالحقيقة!"',
      },
      {
        text: 'اعترفت زبدة للولو بالحقيقة. قالت لها لولو: "أنا فخورة بك يا زبدة لأنك قلتِ الحقيقة. الصدق أجمل شيء!" قالت [guide]: "[good] يا [name]! [you_are] [proud] دائمًا عندما تقول الحقيقة!"',
      },
    ],
  },
  {
    id: 'kindness',
    title: 'ميمي تساعد لولو',
    description: 'قصة ميمي القطة عن اللطف ومساعدة الآخرين',
    moral: 'اللطف يجعل العالم جميلًا!',
    color: '#FF6B81',
    image: '/images/stories/kindness.png',
    characterIds: ['mimi', 'lolo'],
    pages: [
      {
        text: 'كانت هناك قطة صغيرة اسمها ميمي 🐱. كانت ميمي تحب أن تساعد الجميع في الغابة. كانت تساعد العصافير والفراشات وحتى النمل الصغير!',
        image: '/images/stories/kindness.png',
      },
      {
        text: 'ذات يوم، رأت ميمي لولو السلحفاة 🐢 تحمل ثقيلًا من الأوراق إلى بيتها. كانت لولو متعبة جدًا لكنها لم تستطع أن تطلب مساعدة. قالت ميمي: "لا تقلقي يا لولو، سأساعدك!"',
      },
      {
        text: 'قالت [guide] لميمي: "[you_are] طيبة جدًا يا ميمي! اللطف هو أجمل شيء يمكننا فعله. [name] أيضًا يحب أن يساعد الآخرين مثلك تمامًا! دعينا نساعد لولو معًا!"',
      },
      {
        text: 'ساعدت ميمي لولو حتى وصلت إلى بيتها. شكرتها لولو كثيرًا وقالت: "أنتِ صديقة رائعة يا ميمي!" قالت [guide]: "[good] يا [name]! [you_are] بطلة حقيقية! اللطف يجعل العالم مكانًا جميلًا!"',
      },
    ],
  },
]

// ===== Arabic Alphabet Data =====
export interface ArabicLetter {
  letter: string
  name: string
  word: string
  wordImage: string
  pronunciation: string
}

export const arabicLetters: ArabicLetter[] = [
  { letter: 'أ', name: 'ألف', word: 'أسد', wordImage: '🦁', pronunciation: 'a' },
  { letter: 'ب', name: 'باء', word: 'باب', wordImage: '🚪', pronunciation: 'b' },
  { letter: 'ت', name: 'تاء', word: 'تفاح', wordImage: '🍎', pronunciation: 't' },
  { letter: 'ث', name: 'ثاء', word: 'ثعلب', wordImage: '🦊', pronunciation: 'th' },
  { letter: 'ج', name: 'جيم', word: 'جمل', wordImage: '🐫', pronunciation: 'j' },
  { letter: 'ح', name: 'حاء', word: 'حصان', wordImage: '🐴', pronunciation: 'h' },
  { letter: 'خ', name: 'خاء', word: 'خروف', wordImage: '🐑', pronunciation: 'kh' },
  { letter: 'د', name: 'دال', word: 'ديك', wordImage: '🐓', pronunciation: 'd' },
  { letter: 'ذ', name: 'ذال', word: 'ذرة', wordImage: '🌽', pronunciation: 'dh' },
  { letter: 'ر', name: 'راء', word: 'رمان', wordImage: '🍎', pronunciation: 'r' },
  { letter: 'ز', name: 'زاي', word: 'زرافة', wordImage: '🦒', pronunciation: 'z' },
  { letter: 'س', name: 'سين', word: 'سمكة', wordImage: '🐟', pronunciation: 's' },
  { letter: 'ش', name: 'شين', word: 'شمس', wordImage: '☀️', pronunciation: 'sh' },
  { letter: 'ص', name: 'صاد', word: 'صقر', wordImage: '🦅', pronunciation: 's' },
  { letter: 'ض', name: 'ضاد', word: 'ضفدع', wordImage: '🐸', pronunciation: 'dh' },
  { letter: 'ط', name: 'طاء', word: 'طائرة', wordImage: '✈️', pronunciation: 't' },
  { letter: 'ظ', name: 'ظاء', word: 'ظرف', wordImage: '✉️', pronunciation: 'dh' },
  { letter: 'ع', name: 'عين', word: 'عصفور', wordImage: '🐦', pronunciation: 'a' },
  { letter: 'غ', name: 'غين', word: 'غزال', wordImage: '🦌', pronunciation: 'gh' },
  { letter: 'ف', name: 'فاء', word: 'فراشة', wordImage: '🦋', pronunciation: 'f' },
  { letter: 'ق', name: 'قاف', word: 'قمر', wordImage: '🌙', pronunciation: 'q' },
  { letter: 'ك', name: 'كاف', word: 'كتاب', wordImage: '📖', pronunciation: 'k' },
  { letter: 'ل', name: 'لام', word: 'ليمون', wordImage: '🍋', pronunciation: 'l' },
  { letter: 'م', name: 'ميم', word: 'موز', wordImage: '🍌', pronunciation: 'm' },
  { letter: 'ن', name: 'نون', word: 'نجمة', wordImage: '⭐', pronunciation: 'n' },
  { letter: 'ه', name: 'هاء', word: 'هلال', wordImage: '🌙', pronunciation: 'h' },
  { letter: 'و', name: 'واو', word: 'وردة', wordImage: '🌹', pronunciation: 'w' },
  { letter: 'ي', name: 'ياء', word: 'يد', wordImage: '✋', pronunciation: 'y' },
]

// ===== Coloring Pages Data =====
export interface ColoringPage {
  id: string
  title: string
  description: string
  image: string
  color: string
  characterId: string | null
}

export const coloringPages: ColoringPage[] = [
  { id: 'sami', title: 'سامي الأسد', description: 'لوّن سامي الأسد الشجاع يا [name]! سامي أسد لطيف جدًا', image: '/images/coloring/lion.png', color: '#FF9F43', characterId: 'sami' },
  { id: 'zobda', title: 'زبدة الأرنب', description: 'هيا نلوّن زبدة يا [name]! زبدة أرنب صادق وجميل', image: '/images/coloring/rabbit.png', color: '#FF6B81', characterId: 'zobda' },
  { id: 'mimi', title: 'ميمي القطة', description: 'لوّن ميمي القطة المؤدبة يا [name]!', image: '/images/coloring/cat.png', color: '#A29BFE', characterId: 'mimi' },
  { id: 'bobsos', title: 'بسبوس الدب', description: 'بسبوس دب حنون يا [name]! هيا نلوّنه', image: '/images/coloring/bear.png', color: '#D4915C', characterId: 'bobsos' },
  { id: 'bulbul', title: 'بلبل العصفور', description: 'بلبل عصفور طيب يا [name]! لوّنه بألوان جميلة', image: '/images/coloring/bird.png', color: '#FECA57', characterId: 'bulbul' },
  { id: 'noora', title: 'نورة النجمة', description: 'نورة نجمة متفائلة يا [name]! لوّنيها بالأصفر', image: '/images/coloring/star.png', color: '#F9CA24', characterId: 'noora' },
  { id: 'lolo', title: 'لولو السلحفاة', description: 'لولو سلحفاة ذكية يا [name]! ما هو لونها المفضل؟', image: '/images/coloring/turtle.png', color: '#2ED573', characterId: 'lolo' },
  { id: 'apple', title: 'تفاحة حمراء', description: 'لوّن تفاحة لذيذة يا [name]!', image: '/images/coloring/apple.png', color: '#FF6B81', characterId: null },
  { id: 'house', title: 'بيت جميل', description: 'لوّن بيتًا جميلًا يا [name]!', image: '/images/coloring/house.png', color: '#48DBFB', characterId: null },
  { id: 'moon-stars', title: 'قمر ونجوم', description: 'لوّن القمر والنجوم يا [name]!', image: '/images/coloring/moon-stars.png', color: '#A29BFE', characterId: null },
  { id: 'butterfly', title: 'فراشة ملونة', description: 'لوّن فراشة جميلة يا [name]!', image: '/images/coloring/butterfly.png', color: '#A29BFE', characterId: null },
]

// ===== Utility Functions =====

// Get random item from array
export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Generate clear TTS text for a letter (no emojis, child-friendly phrasing)
export function getLetterTTS(letter: ArabicLetter): string {
  return `حرف ${letter.name}. ${letter.word}`
}

// Generate clear TTS text for a word example (no emojis)
export function getWordTTS(letter: ArabicLetter): string {
  return `${letter.word}`
}

// Clean text for TTS (remove emojis and special chars that TTS can't read)
export function cleanTextForTTS(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')  // Remove emojis
    .replace(/[\u{2600}-\u{26FF}]/gu, '')      // Remove misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')      // Remove dingbats
    .replace(/\s+/g, ' ')                        // Normalize spaces
    .trim()
}

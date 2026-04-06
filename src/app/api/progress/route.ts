import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Get progress for a child
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')

    if (!childId) {
      return NextResponse.json({ error: 'childId is required' }, { status: 400 })
    }

    const [letters, storiesData] = await Promise.all([
      db.letterProgress.findMany({
        where: { childId },
      }),
      db.storyProgress.findMany({
        where: { childId },
      }),
    ])

    return NextResponse.json({ letters, stories: storiesData })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

// POST: Update progress (mark letter or story as completed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId, type, itemId } = body

    if (!childId || !type || !itemId) {
      return NextResponse.json(
        { error: 'childId, type, and itemId are required' },
        { status: 400 }
      )
    }

    if (type === 'letter') {
      const progress = await db.letterProgress.upsert({
        where: {
          childId_letter: { childId, letter: itemId },
        },
        create: {
          childId,
          letter: itemId,
          completed: true,
        },
        update: {
          completed: true,
        },
      })
      return NextResponse.json(progress)
    } else if (type === 'story') {
      const progress = await db.storyProgress.upsert({
        where: {
          childId_storyId: { childId, storyId: itemId },
        },
        create: {
          childId,
          storyId: itemId,
          completed: true,
        },
        update: {
          completed: true,
        },
      })
      return NextResponse.json(progress)
    }

    return NextResponse.json({ error: 'Invalid type. Use "letter" or "story"' }, { status: 400 })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

// DELETE: Reset all progress for a child
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId } = body

    if (!childId) {
      return NextResponse.json({ error: 'childId is required' }, { status: 400 })
    }

    await Promise.all([
      db.letterProgress.deleteMany({ where: { childId } }),
      db.storyProgress.deleteMany({ where: { childId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error resetting progress:', error)
    return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 })
  }
}

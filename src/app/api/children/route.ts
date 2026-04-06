import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List all children
export async function GET() {
  try {
    const children = await db.child.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(children)
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 })
  }
}

// POST: Create a new child
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, avatarColor, gender } = body

    if (!name || !name.trim() || !avatarColor) {
      return NextResponse.json(
        { error: 'Name and avatarColor are required' },
        { status: 400 }
      )
    }

    const child = await db.child.create({
      data: {
        name: name.trim(),
        avatarColor,
        gender: gender === 'girl' ? 'girl' : 'boy',
      },
    })

    return NextResponse.json(child, { status: 201 })
  } catch (error) {
    console.error('Error creating child:', error)
    return NextResponse.json({ error: 'Failed to create child' }, { status: 500 })
  }
}

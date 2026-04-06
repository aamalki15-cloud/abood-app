import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Get single child
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const child = await db.child.findUnique({
      where: { id },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    return NextResponse.json(child)
  } catch (error) {
    console.error('Error fetching child:', error)
    return NextResponse.json({ error: 'Failed to fetch child' }, { status: 500 })
  }
}

// DELETE: Delete a child and all associated progress
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.child.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting child:', error)
    return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 })
  }
}

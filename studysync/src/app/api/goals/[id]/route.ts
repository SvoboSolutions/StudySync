import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Toggle Goal Completion
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 })
    }

    const { id } = await params // ✅ AWAIT params
    const body = await request.json()

    const goal = await prisma.goal.findFirst({
      where: { 
        id: id,
        course: {
          userId: user.id
        }
      }
    })

    if (!goal) {
      return NextResponse.json({ error: 'Ziel nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: id },
      data: { completed: body.completed }
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Ziels' }, { status: 500 })
  }
}

// DELETE Goal
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 })
    }

    const { id } = await params // ✅ AWAIT params

    const goal = await prisma.goal.findFirst({
      where: { 
        id: id,
        course: {
          userId: user.id
        }
      }
    })

    if (!goal) {
      return NextResponse.json({ error: 'Ziel nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    await prisma.goal.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Ziel erfolgreich gelöscht' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen des Ziels' }, { status: 500 })
  }
}
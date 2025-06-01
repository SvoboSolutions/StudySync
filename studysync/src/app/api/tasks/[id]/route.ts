import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Toggle Task Completion
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

    const task = await prisma.task.findFirst({
      where: { 
        id: id,
        goal: {
          course: {
            userId: user.id
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Aufgabe nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: { completed: body.completed }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der Aufgabe' }, { status: 500 })
  }
}
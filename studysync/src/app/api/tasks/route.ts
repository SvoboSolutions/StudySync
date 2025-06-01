import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
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

    const body = await request.json()
    
    // Prüfen ob das Goal dem User gehört (über Course)
    const goal = await prisma.goal.findFirst({
      where: { 
        id: body.goalId,
        course: {
          userId: user.id
        }
      }
    })

    if (!goal) {
      return NextResponse.json({ error: 'Ziel nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        estimatedHours: body.estimatedHours || null,
        goalId: body.goalId
      }
    })
    
    return NextResponse.json(task)
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Erstellen der Aufgabe',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 })
  }
}
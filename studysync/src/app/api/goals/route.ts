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
    
    // Prüfen ob der Kurs dem User gehört
    const course = await prisma.course.findFirst({
      where: { 
        id: body.courseId,
        userId: user.id
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    const goal = await prisma.goal.create({
      data: {
        title: body.title,
        description: body.description,
        deadline: new Date(body.deadline),
        priority: body.priority,
        courseId: body.courseId
      }
    })
    
    return NextResponse.json(goal)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Ziels' }, { status: 500 })
  }
}
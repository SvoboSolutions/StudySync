import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(
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

    const { id } = await params
    const body = await request.json()
    const { completed } = body

    // Prüfen ob der Kurs dem User gehört
    const course = await prisma.course.findFirst({
      where: { 
        id: id,
        userId: user.id 
      },
      include: {
        goals: {
          include: {
            tasks: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    // Wenn Kurs als abgeschlossen markiert wird, auch alle Goals und Tasks abschließen
    if (completed) {
      // Alle Goals des Kurses abschließen
      await prisma.goal.updateMany({
        where: { courseId: id },
        data: { completed: true }
      })

      // Alle Tasks der Goals abschließen
      const goalIds = course.goals.map(goal => goal.id)
      await prisma.task.updateMany({
        where: { goalId: { in: goalIds } },
        data: { completed: true }
      })

      // Kurs abschließen
      const updatedCourse = await prisma.course.update({
        where: { id: id },
        data: { 
          completed: true,
          completedAt: new Date()
        },
        include: {
          goals: {
            include: {
              tasks: true
            }
          }
        }
      })

      return NextResponse.json(updatedCourse)
    } else {
      // Kurs wieder öffnen (ohne Goals/Tasks zu ändern)
      const updatedCourse = await prisma.course.update({
        where: { id: id },
        data: { 
          completed: false,
          completedAt: null
        },
        include: {
          goals: {
            include: {
              tasks: true
            }
          }
        }
      })

      return NextResponse.json(updatedCourse)
    }
  } catch (error) {
    console.error('Course completion error:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Abschließen des Kurses',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 })
  }
}
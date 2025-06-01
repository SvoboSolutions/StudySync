import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// GET einzelner Kurs
export async function GET(
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
      return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden des Kurses' }, { status: 500 })
  }
}

// UPDATE Kurs
export async function PUT(
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
    
    const course = await prisma.course.updateMany({
      where: { 
        id: id,
        userId: user.id
      },
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        color: body.color
      }
    })

    if (course.count === 0) {
      return NextResponse.json({ error: 'Kurs nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    const updatedCourse = await prisma.course.findUnique({
      where: { id: id }
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Kurses' }, { status: 500 })
  }
}

// DELETE Kurs
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

    const result = await prisma.course.deleteMany({
      where: { 
        id: id,
        userId: user.id
      }
    })

    if (result.count === 0) {
      return NextResponse.json({ error: 'Kurs nicht gefunden oder keine Berechtigung' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Kurs erfolgreich gelöscht' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen des Kurses' }, { status: 500 })
  }
}
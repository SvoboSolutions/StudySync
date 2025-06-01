import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Finde User anhand der Email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 })
    }

    // Nur Kurse des eingeloggten Users laden
    const courses = await prisma.course.findMany({
      where: { userId: user.id },
      include: {
        goals: {
          include: {
            tasks: true
          }
        }
      }
    })
    
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Finde User anhand der Email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 })
    }

    const body = await request.json()
    
    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        color: body.color || '#3B82F6',
        userId: user.id // Echte User ID aus Session
      }
    })
    
    return NextResponse.json(course)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
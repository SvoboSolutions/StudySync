import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Demo-User erstellen
  const hashedPassword = await hash('demo123', 10)
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@studysync.com',
      name: 'Max Mustermann',
      password: hashedPassword,
    },
  })

  console.log('✅ Demo-User erstellt:', demoUser.email)

  // Kurs 1: Web Development
  const webDevCourse = await prisma.course.create({
    data: {
      title: 'Full-Stack Web Development',
      description: 'Kompletter Kurs für moderne Webentwicklung mit React, Node.js und Datenbanken',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-15'),
      color: '#3B82F6',
      userId: demoUser.id,
      goals: {
        create: [
          {
            title: 'Frontend Grundlagen meistern',
            description: 'HTML, CSS, JavaScript und React lernen',
            deadline: new Date('2024-03-01'),
            priority: 'HIGH',
            tasks: {
              create: [
                {
                  title: 'HTML & CSS Grundlagen',
                  description: 'Semantisches HTML und modernes CSS lernen',
                  dueDate: new Date('2024-02-01'),
                  estimatedHours: 20,
                },
                {
                  title: 'JavaScript ES6+',
                  description: 'Moderne JavaScript-Features und DOM-Manipulation',
                  dueDate: new Date('2024-02-15'),
                  estimatedHours: 30,
                },
                {
                  title: 'React Basics',
                  description: 'Components, Props, State und Hooks',
                  dueDate: new Date('2024-03-01'),
                  estimatedHours: 25,
                  completed: true,
                },
              ],
            },
          },
          {
            title: 'Backend Development',
            description: 'Node.js, Express und Datenbank-Integration',
            deadline: new Date('2024-04-15'),
            priority: 'MEDIUM',
            tasks: {
              create: [
                {
                  title: 'Node.js & Express Setup',
                  description: 'Server aufsetzen und REST APIs erstellen',
                  dueDate: new Date('2024-03-15'),
                  estimatedHours: 15,
                },
                {
                  title: 'Datenbank Design',
                  description: 'PostgreSQL und Prisma ORM',
                  dueDate: new Date('2024-04-01'),
                  estimatedHours: 20,
                },
                {
                  title: 'Authentication implementieren',
                  description: 'JWT und sichere Login-Funktionen',
                  dueDate: new Date('2024-04-15'),
                  estimatedHours: 18,
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Kurs 2: Data Science
  const dataScienceCourse = await prisma.course.create({
    data: {
      title: 'Data Science mit Python',
      description: 'Datenanalyse, Machine Learning und Visualisierung',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-01'),
      color: '#10B981',
      userId: demoUser.id,
      goals: {
        create: [
          {
            title: 'Python für Data Science',
            description: 'Pandas, NumPy und Matplotlib beherrschen',
            deadline: new Date('2024-04-01'),
            priority: 'HIGH',
            tasks: {
              create: [
                {
                  title: 'Python Grundlagen',
                  description: 'Syntax, Datentypen und Kontrollstrukturen',
                  dueDate: new Date('2024-02-15'),
                  estimatedHours: 25,
                  completed: true,
                },
                {
                  title: 'Pandas DataFrame Operationen',
                  description: 'Daten laden, bereinigen und transformieren',
                  dueDate: new Date('2024-03-01'),
                  estimatedHours: 30,
                },
                {
                  title: 'Datenvisualisierung',
                  description: 'Matplotlib und Seaborn für Grafiken',
                  dueDate: new Date('2024-03-15'),
                  estimatedHours: 20,
                },
              ],
            },
          },
          {
            title: 'Machine Learning Basics',
            description: 'Supervised und Unsupervised Learning',
            deadline: new Date('2024-06-01'),
            priority: 'MEDIUM',
            tasks: {
              create: [
                {
                  title: 'Scikit-learn Einführung',
                  description: 'Erste ML-Modelle trainieren',
                  dueDate: new Date('2024-04-15'),
                  estimatedHours: 35,
                },
                {
                  title: 'Modell-Evaluation',
                  description: 'Cross-Validation und Metriken',
                  dueDate: new Date('2024-05-01'),
                  estimatedHours: 25,
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Kurs 3: Mobile Development (abgeschlossen)
  const mobileCourse = await prisma.course.create({
    data: {
      title: 'React Native Development',
      description: 'Cross-Platform Mobile Apps entwickeln',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2023-12-15'),
      color: '#8B5CF6',
      completed: true,
      completedAt: new Date('2023-12-10'),
      userId: demoUser.id,
      goals: {
        create: [
          {
            title: 'React Native Setup',
            description: 'Entwicklungsumgebung einrichten',
            deadline: new Date('2023-09-15'),
            priority: 'HIGH',
            completed: true,
            tasks: {
              create: [
                {
                  title: 'Expo CLI Installation',
                  description: 'Development Environment setup',
                  dueDate: new Date('2023-09-05'),
                  estimatedHours: 5,
                  completed: true,
                },
                {
                  title: 'Erste App erstellen',
                  description: 'Hello World App mit Navigation',
                  dueDate: new Date('2023-09-15'),
                  estimatedHours: 10,
                  completed: true,
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Progress Logs hinzufügen
  const completedTasks = await prisma.task.findMany({
    where: { completed: true },
  })

  for (const task of completedTasks) {
    await prisma.progressLog.create({
      data: {
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Zufälliges Datum der letzten 30 Tage
        timeSpent: Math.floor(Math.random() * 4) + 1, // 1-4 Stunden
        notes: `Aufgabe "${task.title}" erfolgreich abgeschlossen. Gute Fortschritte gemacht!`,
        userId: demoUser.id,
        taskId: task.id,
      },
    })
  }

  // Zusätzliche Progress Logs für aktuelle Arbeiten
  const inProgressTasks = await prisma.task.findMany({
    where: { 
      completed: false,
      title: { contains: 'Pandas' }
    },
  })

  if (inProgressTasks.length > 0) {
    await prisma.progressLog.createMany({
      data: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // vor 2 Tagen
          timeSpent: 2,
          notes: 'Angefangen mit Pandas DataFrame Operationen. Erste Übungen gemacht.',
          userId: demoUser.id,
          taskId: inProgressTasks[0].id,
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // gestern
          timeSpent: 3,
          notes: 'Weiter mit Pandas. Data Cleaning Techniken gelernt.',
          userId: demoUser.id,
          taskId: inProgressTasks[0].id,
        },
      ],
    })
  }

  console.log('🎉 Seeding completed successfully!')
  console.log(`📊 Erstellt:`)
  console.log(`   - 1 Demo-User (${demoUser.email})`)
  console.log(`   - 3 Kurse (Web Dev, Data Science, Mobile - abgeschlossen)`)
  console.log(`   - 4 Ziele mit verschiedenen Prioritäten`)
  console.log(`   - 8 Aufgaben (einige abgeschlossen)`)
  console.log(`   - Progress Logs für Zeiterfassung`)
  console.log(``)
  console.log(`🔐 Login-Daten:`)
  console.log(`   Email: demo@studysync.com`)
  console.log(`   Password: demo123`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
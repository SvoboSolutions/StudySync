'use client'

import { useRouter } from 'next/navigation'
import { Course } from '@/types'

interface CourseHeaderProps {
  course: Course
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining(course.endDate)
  const completedGoals = course.goals.filter(goal => goal.completed).length
  const totalTasks = course.goals.reduce((acc, goal) => acc + goal.tasks.length, 0)
  const completedTasks = course.goals.reduce((acc, goal) => 
    acc + goal.tasks.filter(task => task.completed).length, 0
  )

  return (
    <div className="mb-8">
      <button
        onClick={() => router.push('/')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <span className="mr-2">←</span>
        Zurück zu meinen Kursen
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div 
          className="h-4 w-full"
          style={{ backgroundColor: course.color }}
        />
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-gray-600 mb-4">{course.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">📅</span>
                  {formatDate(course.startDate)} - {formatDate(course.endDate)}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">⏱️</span>
                  <span className={`font-semibold ${
                    daysRemaining < 7 
                      ? 'text-red-600' 
                      : daysRemaining < 30 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                  }`}>
                    {daysRemaining > 0 
                      ? `${daysRemaining} Tage verbleibend` 
                      : 'Überfällig'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="ml-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {completedGoals}/{course.goals.length}
                </div>
                <div className="text-sm text-blue-800">Ziele</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {completedTasks}/{totalTasks}
                </div>
                <div className="text-sm text-green-800">Aufgaben</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
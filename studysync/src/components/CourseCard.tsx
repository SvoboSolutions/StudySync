'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  color: string
  completed?: boolean
  completedAt?: string | null
  goals?: Goal[]
}

interface Goal {
  id: string
  completed: boolean
  tasks: Task[]
}

interface Task {
  id: string
  completed: boolean
}

interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
  onComplete?: (courseId: string, completed: boolean) => void
}

export function CourseCard({ course, onEdit, onDelete, onComplete }: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
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

  const getCourseProgress = () => {
    if (!course.goals || course.goals.length === 0) {
      return { percentage: 0, completedTasks: 0, totalTasks: 0, completedGoals: 0, totalGoals: 0 }
    }

    const totalGoals = course.goals.length
    const completedGoals = course.goals.filter(goal => goal.completed).length
    
    const totalTasks = course.goals.reduce((acc, goal) => acc + goal.tasks.length, 0)
    const completedTasks = course.goals.reduce((acc, goal) => 
      acc + goal.tasks.filter(task => task.completed).length, 0
    )

    let percentage = 0
    if (totalGoals > 0) {
      percentage += (completedGoals / totalGoals) * 50
    }
    if (totalTasks > 0) {
      percentage += (completedTasks / totalTasks) * 50
    }

    return {
      percentage: Math.round(percentage),
      completedTasks,
      totalTasks,
      completedGoals,
      totalGoals
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Möchtest du den Kurs "${course.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      onDelete(course.id)
    }
  }

  const handleComplete = async () => {
    if (isCompleting) return

    const action = course.completed ? 'wieder öffnen' : 'abschließen'
    
    if (window.confirm(
      course.completed 
        ? `Möchtest du den Kurs "${course.title}" wieder öffnen?`
        : `Möchtest du den Kurs "${course.title}" als abgeschlossen markieren? Alle Ziele und Aufgaben werden automatisch als erledigt markiert.`
    )) {
      setIsCompleting(true)
      if (onComplete) {
        await onComplete(course.id, !course.completed)
      }
      setIsCompleting(false)
      setShowMenu(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/courses/${course.id}`)
  }

  const daysRemaining = getDaysRemaining(course.endDate)
  const progress = getCourseProgress()

  const getProgressColor = (percentage: number) => {
    if (course.completed) return 'bg-green-500'
    if (percentage === 0) return 'bg-gray-300'
    if (percentage < 25) return 'bg-red-500'
    if (percentage < 50) return 'bg-orange-500'
    if (percentage < 75) return 'bg-yellow-500'
    if (percentage < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getProgressLabel = (percentage: number) => {
    if (course.completed) return 'Abgeschlossen'
    if (percentage === 0) return 'Noch nicht begonnen'
    if (percentage < 25) return 'Gerade gestartet'
    if (percentage < 50) return 'In Bearbeitung'
    if (percentage < 75) return 'Guter Fortschritt'
    if (percentage < 100) return 'Fast fertig'
    return 'Bereit zum Abschluss'
  }

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden group hover:scale-105 cursor-pointer ${
        course.completed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-100'
      }`}
      onClick={handleCardClick}
    >
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: course.completed ? '#10B981' : course.color }}
      />
      
      <div className="p-6 relative">
        {/* Completed Badge */}
        {course.completed && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✅ ABGESCHLOSSEN
          </div>
        )}

        {/* Dropdown Menu */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 min-w-[180px]">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleComplete()
                }}
                disabled={isCompleting}
                className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                  course.completed
                    ? 'text-orange-600 hover:bg-orange-50'
                    : 'text-green-600 hover:bg-green-50'
                } ${isCompleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="mr-2">
                  {isCompleting ? '⏳' : course.completed ? '🔄' : '✅'}
                </span>
                {isCompleting 
                  ? 'Wird verarbeitet...' 
                  : course.completed 
                  ? 'Wieder öffnen' 
                  : 'Kurs abschließen'
                }
              </button>
              
              <hr className="my-1" />
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(course)
                  setShowMenu(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">✏️</span>
                Bearbeiten
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                  setShowMenu(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <span className="mr-2">🗑️</span>
                Löschen
              </button>
            </div>
          )}
        </div>

        <h3 className={`font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors ${
          course.completed ? 'text-green-800 mt-8' : 'text-gray-900 pr-10'
        }`}>
          {course.title}
        </h3>
        
        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Completion Date */}
        {course.completed && course.completedAt && (
          <div className="mb-4 p-3 bg-green-100 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm font-medium">
              🏆 Abgeschlossen am {formatDate(course.completedAt)}
            </p>
          </div>
        )}

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Fortschritt
            </span>
            <span className={`text-sm font-bold ${
              course.completed || progress.percentage === 100 ? 'text-green-600' : 'text-blue-600'
            }`}>
              {course.completed ? '100' : progress.percentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress.percentage)}`}
              style={{ width: `${course.completed ? 100 : progress.percentage}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            {course.completed ? (
              <span>🎉 Kurs erfolgreich abgeschlossen!</span>
            ) : progress.percentage === 0 ? (
              <span>🏁 Bereit zum Start!</span>
            ) : (
              <span>
                {getProgressLabel(progress.percentage)} • {' '}
                {progress.totalGoals > 0 && `${progress.completedGoals}/${progress.totalGoals} Ziele`}
                {progress.totalGoals > 0 && progress.totalTasks > 0 && ' • '}
                {progress.totalTasks > 0 && `${progress.completedTasks}/${progress.totalTasks} Aufgaben`}
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <span className="mr-2">📅</span>
            {formatDate(course.startDate)} - {formatDate(course.endDate)}
          </div>
          
          {!course.completed && (
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
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Kurs öffnen →
            </button>
            
            {course.completed && (
              <span className="text-green-600 text-sm font-medium">
                ✅ Abgeschlossen
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
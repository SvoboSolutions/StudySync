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
}

interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false)
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

  const handleDelete = () => {
    if (window.confirm(`Möchtest du den Kurs "${course.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      onDelete(course.id)
    }
  }

  const handleCardClick = () => {
    router.push(`/courses/${course.id}`)
  }

  const daysRemaining = getDaysRemaining(course.endDate)

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:scale-105 cursor-pointer">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: course.color }}
      />
      
      <div className="p-6 relative" onClick={handleCardClick}>
        {/* Dropdown Menu */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation() // Verhindert Navigation beim Klick auf Menu
              setShowMenu(!showMenu)
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 min-w-[150px]">
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

        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors pr-10">
          {course.title}
        </h3>
        
        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
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
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Kurs öffnen →
          </button>
        </div>
      </div>
    </div>
  )
}
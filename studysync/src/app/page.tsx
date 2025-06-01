'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/AuthGuard'
import { Header } from '@/components/Header'
import { CourseForm } from '@/components/CourseForm'
import { CourseCard } from '@/components/CourseCard'

interface Course {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  color: string
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]) // Sicherstellen dass es ein Array ist
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      
      // Bessere Fehlerbehandlung
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden der Kurse')
      }
      
      // Sicherstellen dass data ein Array ist
      if (Array.isArray(data)) {
        setCourses(data)
        setError(null)
      } else {
        console.error('API returned non-array:', data)
        setCourses([])
        setError('Unerwartete API-Antwort')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses([]) // Fallback zu leerem Array
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = async (formData: any) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowForm(false)
        fetchCourses()
        setError(null)
      } else {
        setError(data.error || 'Fehler beim Erstellen des Kurses')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      setError('Fehler beim Erstellen des Kurses')
    }
  }

  const handleUpdateCourse = async (formData: any) => {
    try {
      const response = await fetch(`/api/courses/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowForm(false)
        setEditCourse(null)
        fetchCourses()
        setError(null)
      } else {
        setError(data.error || 'Fehler beim Aktualisieren des Kurses')
      }
    } catch (error) {
      console.error('Error updating course:', error)
      setError('Fehler beim Aktualisieren des Kurses')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        fetchCourses()
        setError(null)
      } else {
        setError(data.error || 'Fehler beim Löschen des Kurses')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      setError('Fehler beim Löschen des Kurses')
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditCourse(course)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditCourse(null)
  }

  const handleSubmitForm = (formData: any) => {
    if (editCourse) {
      handleUpdateCourse(formData)
    } else {
      handleCreateCourse(formData)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <strong>Fehler:</strong> {error}
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Meine Kurse</h2>
              <p className="text-gray-600 mt-1">
                Verwalte deine Lernziele und tracke deinen Fortschritt
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowForm(!showForm)
                if (!showForm) setEditCourse(null)
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {showForm ? (
                <>
                  <span className="mr-2">✕</span>
                  Abbrechen
                </>
              ) : (
                <>
                  <span className="mr-2">+</span>
                  Neuer Kurs
                </>
              )}
            </button>
          </div>

          {showForm && (
            <CourseForm 
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              editCourse={editCourse}
            />
          )}

          {courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Noch keine Kurse vorhanden
              </h3>
              <p className="text-gray-500 mb-6">
                Erstelle deinen ersten Kurs um mit dem Lernen zu beginnen!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">+</span>
                Ersten Kurs erstellen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
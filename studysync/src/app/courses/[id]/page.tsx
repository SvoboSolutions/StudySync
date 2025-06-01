'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/AuthGuard'
import { Header } from '@/components/Header'
import { CourseHeader } from '@/components/CourseHeader'
import { GoalsList } from '@/components/GoalList'
import { GoalForm } from '@/components/GoalForm'
import { Course } from '@/types'

export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGoalForm, setShowGoalForm] = useState(false)

  // Rest des Codes bleibt exakt gleich...
  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Kurs nicht gefunden')
      }
      
      setCourse(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching course:', error)
      setError(error instanceof Error ? error.message : 'Fehler beim Laden')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewGoal = () => {
    setShowGoalForm(true)
  }

  const handleCreateGoal = async (formData: any) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        setError(`API Fehler: ${response.status} - ${errorText}`)
        return
      }

      const data = await response.json()
      setShowGoalForm(false)
      fetchCourse()
      setError(null)
    } catch (error) {
      console.error('Error creating goal:', error)
      setError('Fehler beim Erstellen des Ziels: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'))
    }
  }

  const handleToggleGoal = async (goalId: string) => {
    try {
      const goal = course?.goals.find(g => g.id === goalId)
      if (!goal) return

      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !goal.completed })
      })

      if (response.ok) {
        fetchCourse()
      } else {
        const data = await response.json()
        setError(data.error || 'Fehler beim Aktualisieren des Ziels')
      }
    } catch (error) {
      console.error('Error toggling goal:', error)
      setError('Fehler beim Aktualisieren des Ziels')
    }
  }

  const handleToggleTask = async (goalId: string, taskId: string) => {
    try {
      const goal = course?.goals.find(g => g.id === goalId)
      const task = goal?.tasks.find(t => t.id === taskId)
      if (!task) return

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })

      if (response.ok) {
        fetchCourse()
      } else {
        const data = await response.json()
        setError(data.error || 'Fehler beim Aktualisieren der Aufgabe')
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      setError('Fehler beim Aktualisieren der Aufgabe')
    }
  }

  const handleCreateTask = async (goalId: string, taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, goalId })
      })

      if (!response.ok) {
        const errorText = await response.text()
        setError(`API Fehler beim Erstellen der Aufgabe: ${response.status} - ${errorText}`)
        return
      }

      const data = await response.json()
      fetchCourse()
      setError(null)
    } catch (error) {
      console.error('Error creating task:', error)
      setError('Fehler beim Erstellen der Aufgabe: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'))
    }
  }

  const handleCancelGoalForm = () => {
    setShowGoalForm(false)
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

  if (error || !course) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">😵</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Kurs nicht gefunden</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Zurück zur Übersicht
              </button>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <CourseHeader course={course} />
          
          {showGoalForm && (
            <GoalForm
              courseId={courseId}
              onSubmit={handleCreateGoal}
              onCancel={handleCancelGoalForm}
            />
          )}
          
          <GoalsList
            goals={course.goals}
            onNewGoal={handleNewGoal}
            onToggleGoal={handleToggleGoal}
            onToggleTask={handleToggleTask}
            onCreateTask={handleCreateTask}
          />
        </main>
      </div>
    </AuthGuard>
  )
}
'use client'

import { Goal } from '@/types'

interface GoalProgressProps {
  goal: Goal
  onToggleGoal: (goalId: string) => void
}

export function GoalProgress({ goal, onToggleGoal }: GoalProgressProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const end = new Date(deadline)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getProgressPercentage = () => {
    if (goal.tasks.length === 0) return 0
    const completedTasks = goal.tasks.filter(task => task.completed).length
    return Math.round((completedTasks / goal.tasks.length) * 100)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: '🔥' }
      case 'HIGH': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: '⚡' }
      case 'MEDIUM': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: '⚠️' }
      case 'LOW': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: '🟢' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: '⚪' }
    }
  }

  const daysRemaining = getDaysRemaining(goal.deadline)
  const progress = getProgressPercentage()
  const priorityStyle = getPriorityColor(goal.priority)
  const completedTasks = goal.tasks.filter(task => task.completed).length
  const totalTasks = goal.tasks.length

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={() => onToggleGoal(goal.id)}
            className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <h3 className={`text-lg font-semibold ${
              goal.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {goal.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} mt-1`}>
              {priorityStyle.icon} {goal.priority}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">
            📅 {formatDate(goal.deadline)}
          </div>
          <div className={`text-sm font-medium ${
            daysRemaining < 0 ? 'text-red-600' :
            daysRemaining === 0 ? 'text-orange-600' :
            daysRemaining <= 7 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} Tage überfällig` :
             daysRemaining === 0 ? 'Heute fällig' :
             `${daysRemaining} Tage verbleibend`}
          </div>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-gray-600 mb-4">{goal.description}</p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Fortschritt: {completedTasks}/{totalTasks} Aufgaben
          </span>
          <span className="text-sm font-bold text-blue-600">
            {progress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              progress === 100 ? 'bg-green-500' :
              progress >= 75 ? 'bg-blue-500' :
              progress >= 50 ? 'bg-yellow-500' :
              'bg-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick Task Overview */}
      {totalTasks > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              📋 {totalTasks > 3 ? `${totalTasks} Aufgaben` : `${totalTasks} Aufgabe${totalTasks > 1 ? 'n' : ''}`}
            </span>
            <span className="text-blue-600 font-medium">
              Details anzeigen →
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
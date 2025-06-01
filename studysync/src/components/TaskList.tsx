'use client'

import { useState } from 'react'
import { Task } from '@/types'

interface TaskListProps {
  tasks: Task[]
  goalId: string
  onToggleTask: (goalId: string, taskId: string) => void
}

export function TaskList({ tasks, goalId, onToggleTask }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return '🔥 Heute fällig'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '⚡ Morgen fällig'
    } else if (date < today) {
      return '🚨 Überfällig'
    } else {
      return `📅 ${date.toLocaleDateString('de-DE')}`
    }
  }

  const getTaskPriority = (task: Task) => {
    if (!task.dueDate) return 'low'
    
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'overdue'
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'tomorrow'
    if (diffDays <= 7) return 'week'
    return 'low'
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'overdue': return 'border-l-4 border-red-500 bg-red-50'
      case 'today': return 'border-l-4 border-orange-500 bg-orange-50'
      case 'tomorrow': return 'border-l-4 border-yellow-500 bg-yellow-50'
      case 'week': return 'border-l-4 border-blue-500 bg-blue-50'
      default: return 'border-l-4 border-gray-300 bg-gray-50'
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const sortedTasks = filteredTasks.sort((a, b) => {
    // Completed tasks at bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    
    return 0
  })

  return (
    <div className="mt-4">
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alle ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'pending' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Offen ({tasks.filter(t => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Erledigt ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      {/* Tasks */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📋</div>
          <p>
            {filter === 'all' && 'Keine Aufgaben vorhanden'}
            {filter === 'pending' && 'Keine offenen Aufgaben'}
            {filter === 'completed' && 'Keine erledigten Aufgaben'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const priority = getTaskPriority(task)
            return (
              <div
                key={task.id}
                className={`p-4 rounded-lg transition-all hover:shadow-md ${getPriorityStyle(priority)} ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(goalId, task.id)}
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h4>
                      
                      {task.estimatedHours && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          ⏱️ {task.estimatedHours}h
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    
                    {task.dueDate && (
                      <div className="flex items-center mt-2">
                        <span className={`text-xs font-medium ${
                          priority === 'overdue' ? 'text-red-700' :
                          priority === 'today' ? 'text-orange-700' :
                          priority === 'tomorrow' ? 'text-yellow-700' :
                          'text-gray-600'
                        }`}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Goal } from '@/types'
import { TaskForm } from './TaskForm'

interface GoalCardProps {
  goal: Goal
  onToggleGoal: (goalId: string) => void
  onToggleTask: (goalId: string, taskId: string) => void
  onCreateTask: (goalId: string, taskData: any) => void
}

export function GoalCard({ goal, onToggleGoal, onToggleTask, onCreateTask }: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return { text: '🔥 Heute fällig', style: 'text-red-700 font-bold' }
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { text: '⚡ Morgen fällig', style: 'text-orange-600 font-semibold' }
    } else if (date < today) {
      return { text: '🚨 Überfällig', style: 'text-red-800 font-bold bg-red-50 px-2 py-1 rounded' }
    } else {
      return { text: `📅 ${date.toLocaleDateString('de-DE')}`, style: 'text-gray-600' }
    }
  }

  const formatGoalDate = (dateString: string) => {
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

  const filteredTasks = goal.tasks.filter(task => {
    if (taskFilter === 'pending') return !task.completed
    if (taskFilter === 'completed') return task.completed
    return true
  }).sort((a, b) => {
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

  const handleCreateTask = (taskData: any) => {
    onCreateTask(goal.id, taskData)
    setShowTaskForm(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      {/* Goal Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => onToggleGoal(goal.id)}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  goal.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {goal.title}
                </h3>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                    {priorityStyle.icon} {goal.priority}
                  </span>
                  
                  <div className="text-right text-sm">
                    <div className="text-gray-500">📅 {formatGoalDate(goal.deadline)}</div>
                    <div className={`font-medium ${
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
              </div>

              {goal.description && (
                <p className="text-gray-600 mt-2">{goal.description}</p>
              )}

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Fortschritt: {completedTasks}/{totalTasks} Aufgaben
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {progress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress === 100 ? 'bg-green-500' :
                      progress >= 75 ? 'bg-blue-500' :
                      progress >= 50 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Task Summary & Expand Button */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span className={`mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      ▶️
                    </span>
                    📋 {totalTasks} Aufgabe{totalTasks !== 1 ? 'n' : ''}
                    {totalTasks > 0 && ` (${goal.tasks.filter(t => !t.completed).length} offen)`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Tasks Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6">
            {/* Task Form */}
            {showTaskForm && (
              <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                <TaskForm
                  goalId={goal.id}
                  onSubmit={handleCreateTask}
                  onCancel={() => setShowTaskForm(false)}
                />
              </div>
            )}

            {/* Task Filters */}
            {totalTasks > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      taskFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Alle ({totalTasks})
                  </button>
                  <button
                    onClick={() => setTaskFilter('pending')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      taskFilter === 'pending' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Offen ({goal.tasks.filter(t => !t.completed).length})
                  </button>
                  <button
                    onClick={() => setTaskFilter('completed')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      taskFilter === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Erledigt ({completedTasks})
                  </button>
                </div>

                {!showTaskForm && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    + Neue Aufgabe
                  </button>
                )}
              </div>
            )}

            {/* Tasks List */}
            {totalTasks === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-2">📝</div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Noch keine Aufgaben definiert
                </h4>
                <p className="text-gray-500 mb-4">
                  Zerlege dein Lernziel in konkrete, umsetzbare Aufgaben
                </p>
                {!showTaskForm && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Erste Aufgabe erstellen
                  </button>
                )}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>
                  {taskFilter === 'pending' && 'Keine offenen Aufgaben'}
                  {taskFilter === 'completed' && 'Keine erledigten Aufgaben'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const taskDate = task.dueDate ? formatDate(task.dueDate) : null
                  return (
                    <div
                      key={task.id}
                      className={`p-4 bg-white rounded-lg border transition-all hover:shadow-sm ${
                        task.completed ? 'opacity-75' : ''
                      } ${
                        taskDate?.style.includes('bg-red-50') ? 'border-red-200' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(goal.id, task.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h4>
                            
                            <div className="flex items-center space-x-2">
                              {task.estimatedHours && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  ⏱️ {task.estimatedHours}h
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          
                          {task.dueDate && taskDate && (
                            <div className="flex items-center mt-2">
                              <span className={`text-xs font-medium ${taskDate.style}`}>
                                {taskDate.text}
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
        </div>
      )}
    </div>
  )
}
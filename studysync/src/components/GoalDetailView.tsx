'use client'

import { useState } from 'react'
import { Goal } from '@/types'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { GoalProgress } from './GoalProgress'

interface GoalDetailViewProps {
  goal: Goal
  onToggleGoal: (goalId: string) => void
  onToggleTask: (goalId: string, taskId: string) => void
  onCreateTask: (goalId: string, taskData: any) => void
}

export function GoalDetailView({ goal, onToggleGoal, onToggleTask, onCreateTask }: GoalDetailViewProps) {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleCreateTask = (taskData: any) => {
    onCreateTask(goal.id, taskData)
    setShowTaskForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Goal Progress Overview */}
      <div className="relative">
        <GoalProgress goal={goal} onToggleGoal={onToggleGoal} />
        
        {/* Action Menu */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 min-w-[180px]">
              <button
                onClick={() => {
                  setShowTaskForm(true)
                  setShowMenu(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">📋</span>
                Aufgabe hinzufügen
              </button>
              <button
                onClick={() => {
                  setShowTaskDetails(!showTaskDetails)
                  setShowMenu(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">👁️</span>
                {showTaskDetails ? 'Details ausblenden' : 'Details anzeigen'}
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  if (window.confirm(`Möchtest du das Ziel "${goal.title}" wirklich löschen?`)) {
                    // TODO: Implement goal deletion
                    console.log('Delete goal:', goal.id)
                  }
                  setShowMenu(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <span className="mr-2">🗑️</span>
                Ziel löschen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <TaskForm
            goalId={goal.id}
            onSubmit={handleCreateTask}
            onCancel={() => setShowTaskForm(false)}
          />
        </div>
      )}

      {/* Task Details */}
      {(showTaskDetails || goal.tasks.length === 0) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              📋 Aufgaben für "{goal.title}"
            </h4>
            {!showTaskForm && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                + Neue Aufgabe
              </button>
            )}
          </div>

          {goal.tasks.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-4xl mb-2">📝</div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                Noch keine Aufgaben definiert
              </h4>
              <p className="text-gray-500 mb-4">
                Zerlege dein Lernziel in konkrete, umsetzbare Aufgaben
              </p>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Erste Aufgabe erstellen
              </button>
            </div>
          ) : (
            <TaskList
              tasks={goal.tasks}
              goalId={goal.id}
              onToggleTask={onToggleTask}
            />
          )}
        </div>
      )}

      {/* Quick Actions for Goals with Tasks */}
      {goal.tasks.length > 0 && !showTaskDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                🚀 Bereit zum Lernen?
              </h4>
              <p className="text-sm text-gray-600">
                {goal.tasks.filter(t => !t.completed).length} offene Aufgaben warten auf dich
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTaskDetails(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm border border-blue-200"
              >
                Aufgaben anzeigen
              </button>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                + Aufgabe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { GoalCard } from './GoalCard'
import { Goal } from '@/types'

interface GoalsListProps {
  goals: Goal[]
  onNewGoal: () => void
  onToggleGoal: (goalId: string) => void
  onToggleTask: (goalId: string, taskId: string) => void
  onCreateTask: (goalId: string, taskData: any) => void
}

export function GoalsList({ goals, onNewGoal, onToggleGoal, onToggleTask, onCreateTask }: GoalsListProps) {
  // Sortiere Goals nach Priorität und Deadline
  const sortedGoals = [...goals].sort((a, b) => {
    // Completed goals at bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Sort by priority
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    // Sort by deadline
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lernziele</h2>
          <p className="text-gray-600 mt-1">
            {goals.length > 0 && (
              <>
                {goals.filter(g => g.completed).length}/{goals.length} Ziele erreicht • {' '}
                {goals.reduce((acc, goal) => acc + goal.tasks.filter(t => t.completed).length, 0)}/
                {goals.reduce((acc, goal) => acc + goal.tasks.length, 0)} Aufgaben erledigt
              </>
            )}
          </p>
        </div>
        
        <button
          onClick={onNewGoal}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <span className="mr-2">+</span>
          Neues Ziel
        </button>
      </div>

      {/* Goals */}
      {goals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Noch keine Lernziele definiert
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Erstelle dein erstes Lernziel um strukturiert zu lernen! 
            Zerlege große Aufgaben in kleinere, messbare Schritte.
          </p>
          <button
            onClick={onNewGoal}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            🚀 Erstes Ziel erstellen
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleGoal={onToggleGoal}
              onToggleTask={onToggleTask}
              onCreateTask={onCreateTask}
            />
          ))}
        </div>
      )}

      {/* Achievement Badge */}
      {goals.length > 0 && goals.every(g => g.completed) && (
        <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white text-center">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-xl font-bold mb-2">Glückwunsch!</h3>
          <p>Du hast alle Lernziele für diesen Kurs erreicht! 🎉</p>
        </div>
      )}
    </div>
  )
}
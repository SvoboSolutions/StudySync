'use client'

interface Course {
  id: string
  title: string
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

interface DashboardStatsProps {
  courses: Course[]
}

export function DashboardStats({ courses }: DashboardStatsProps) {
  const getOverallStats = () => {
    let totalCourses = courses.length
    let completedCourses = 0
    let totalGoals = 0
    let completedGoals = 0
    let totalTasks = 0
    let completedTasks = 0
    let totalProgress = 0

    courses.forEach(course => {
      if (!course.goals || course.goals.length === 0) {
        // Kurs ohne Goals/Tasks = 0% Fortschritt
        totalProgress += 0
        return
      }

      const courseGoals = course.goals.length
      const courseCompletedGoals = course.goals.filter(g => g.completed).length
      const courseTasks = course.goals.reduce((acc, goal) => acc + goal.tasks.length, 0)
      const courseCompletedTasks = course.goals.reduce((acc, goal) => 
        acc + goal.tasks.filter(task => task.completed).length, 0
      )

      totalGoals += courseGoals
      completedGoals += courseCompletedGoals
      totalTasks += courseTasks
      completedTasks += courseCompletedTasks

      // Kurs-Fortschritt: 50% Goals + 50% Tasks
      let courseProgress = 0
      if (courseGoals > 0) {
        courseProgress += (courseCompletedGoals / courseGoals) * 50
      }
      if (courseTasks > 0) {
        courseProgress += (courseCompletedTasks / courseTasks) * 50
      }

      totalProgress += courseProgress
      
      // Kurs als "abgeschlossen" zählen wenn >90% Fortschritt
      if (courseProgress > 90) {
        completedCourses++
      }
    })

    const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0

    return {
      totalCourses,
      completedCourses,
      totalGoals,
      completedGoals,
      totalTasks,
      completedTasks,
      averageProgress
    }
  }

  const stats = getOverallStats()

  if (courses.length === 0) {
    return null
  }

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Dein Lernfortschritt</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
          <div className="text-sm text-gray-600">Kurse</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.completedGoals}/{stats.totalGoals}</div>
          <div className="text-sm text-gray-600">Ziele erreicht</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{stats.completedTasks}/{stats.totalTasks}</div>
          <div className="text-sm text-gray-600">Aufgaben erledigt</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{stats.averageProgress}%</div>
          <div className="text-sm text-gray-600">Durchschnitt</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Gesamtfortschritt
          </span>
          <span className="text-sm font-bold text-blue-600">
            {stats.averageProgress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              stats.averageProgress === 100 ? 'bg-green-500' :
              stats.averageProgress >= 75 ? 'bg-blue-500' :
              stats.averageProgress >= 50 ? 'bg-yellow-500' :
              stats.averageProgress >= 25 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${stats.averageProgress}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          {stats.averageProgress === 100 ? '🎉 Alle Kurse abgeschlossen!' :
           stats.averageProgress >= 75 ? '🚀 Fantastischer Fortschritt!' :
           stats.averageProgress >= 50 ? '💪 Guter Fortschritt!' :
           stats.averageProgress >= 25 ? '📈 Du kommst voran!' :
           '🏁 Lass uns starten!'}
        </div>
      </div>
    </div>
  )
}
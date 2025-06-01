export interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completed: boolean
  estimatedHours: number | null
}

export interface Goal {
  id: string
  title: string
  description: string | null
  deadline: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  completed: boolean
  tasks: Task[]
}

export interface Course {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  color: string
  goals: Goal[]
}
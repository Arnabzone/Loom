export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt?: string
  userId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface AuthPayload {
  user: User
  accessToken: string
}

export interface TaskListPayload {
  items: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

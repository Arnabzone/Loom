type DbTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
type DbTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

interface DbTask {
  id: string
  title: string
  description: string
  status: DbTaskStatus
  priority: DbTaskPriority
  dueDate: Date | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

const statusMap = {
  todo: 'TODO',
  'in-progress': 'IN_PROGRESS',
  done: 'DONE',
} as const

const priorityMap = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
} as const

export type ApiTaskStatus = keyof typeof statusMap
export type ApiTaskPriority = keyof typeof priorityMap

export function toPrismaStatus(status: ApiTaskStatus) {
  return statusMap[status]
}

export function fromPrismaStatus(status: DbTaskStatus): ApiTaskStatus {
  if (status === 'IN_PROGRESS') return 'in-progress'
  if (status === 'DONE') return 'done'
  return 'todo'
}

export function toPrismaPriority(priority: ApiTaskPriority) {
  return priorityMap[priority]
}

export function fromPrismaPriority(priority: DbTaskPriority): ApiTaskPriority {
  if (priority === 'HIGH') return 'high'
  if (priority === 'LOW') return 'low'
  return 'medium'
}

export function serializeTask(task: DbTask) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: fromPrismaStatus(task.status),
    priority: fromPrismaPriority(task.priority),
    dueDate: task.dueDate?.toISOString() ?? null,
    userId: task.userId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}

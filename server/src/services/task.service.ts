import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../prisma/client.js'
import { ApiError } from '../utils/api-error.js'
import { serializeTask, toPrismaPriority, toPrismaStatus, type ApiTaskPriority, type ApiTaskStatus } from '../utils/task-mapper.js'

function parseDueDate(dueDate?: string | null) {
  if (dueDate === undefined) return undefined
  if (dueDate === null) return null
  return new Date(dueDate)
}

async function getOwnedTaskOrThrow(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null,
    },
  })

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found')
  }

  return task
}

export async function listTasks(userId: string, query: { page: number; limit: number; status?: ApiTaskStatus | 'pending' | 'completed'; search?: string }) {
  const statusFilter =
    query.status === 'completed'
      ? { status: 'DONE' as const }
      : query.status === 'pending'
        ? { status: { in: ['TODO', 'IN_PROGRESS'] as const } }
        : query.status
          ? { status: toPrismaStatus(query.status) }
          : {}

  const where: Prisma.TaskWhereInput = {
    userId,
    deletedAt: null,
    ...statusFilter,
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ])

  return {
    items: tasks.map(serializeTask),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  }
}

export async function createTask(
  userId: string,
  payload: { title: string; description: string; status: ApiTaskStatus; priority: ApiTaskPriority; dueDate?: string | null },
) {
  const task = await prisma.task.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
      status: toPrismaStatus(payload.status),
      priority: toPrismaPriority(payload.priority),
      dueDate: parseDueDate(payload.dueDate),
    },
  })

  return serializeTask(task)
}

export async function getTaskById(taskId: string, userId: string) {
  const task = await getOwnedTaskOrThrow(taskId, userId)
  return serializeTask(task)
}

export async function updateTask(
  taskId: string,
  userId: string,
  payload: {
    title?: string
    description?: string
    status?: ApiTaskStatus
    priority?: ApiTaskPriority
    dueDate?: string | null
  },
) {
  await getOwnedTaskOrThrow(taskId, userId)

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.status !== undefined ? { status: toPrismaStatus(payload.status) } : {}),
      ...(payload.priority !== undefined ? { priority: toPrismaPriority(payload.priority) } : {}),
      ...(payload.dueDate !== undefined ? { dueDate: parseDueDate(payload.dueDate) } : {}),
    },
  })

  return serializeTask(task)
}

export async function toggleTask(taskId: string, userId: string) {
  const currentTask = await getOwnedTaskOrThrow(taskId, userId)

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: currentTask.status === 'DONE' ? 'TODO' : 'DONE',
    },
  })

  return serializeTask(task)
}

export async function deleteTask(taskId: string, userId: string) {
  await getOwnedTaskOrThrow(taskId, userId)

  await prisma.task.update({
    where: { id: taskId },
    data: {
      deletedAt: new Date(),
    },
  })
}

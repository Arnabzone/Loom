import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  toggleTask,
  updateTask,
} from '../services/task.service.js'
import { sendResponse } from '../utils/response.js'

export async function listTasksController(req: Request, res: Response) {
  const result = await listTasks(req.user!.userId, req.query as never)
  return sendResponse(res, StatusCodes.OK, result, 'Tasks fetched successfully')
}

export async function createTaskController(req: Request, res: Response) {
  const task = await createTask(req.user!.userId, req.body)
  return sendResponse(res, StatusCodes.CREATED, task, 'Task created successfully')
}

export async function getTaskController(req: Request, res: Response) {
  const task = await getTaskById(req.params.id, req.user!.userId)
  return sendResponse(res, StatusCodes.OK, task, 'Task fetched successfully')
}

export async function updateTaskController(req: Request, res: Response) {
  const task = await updateTask(req.params.id, req.user!.userId, req.body)
  return sendResponse(res, StatusCodes.OK, task, 'Task updated successfully')
}

export async function deleteTaskController(req: Request, res: Response) {
  await deleteTask(req.params.id, req.user!.userId)
  return sendResponse(res, StatusCodes.OK, null, 'Task deleted successfully')
}

export async function toggleTaskController(req: Request, res: Response) {
  const task = await toggleTask(req.params.id, req.user!.userId)
  return sendResponse(res, StatusCodes.OK, task, 'Task status toggled successfully')
}

import { Router } from 'express'
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  toggleTaskController,
  updateTaskController,
} from '../controllers/task.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateRequest } from '../middlewares/validate-request.js'
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validators/task.validator.js'

const router = Router()

router.use(authenticate)
router.get('/', validateRequest(listTasksSchema), listTasksController)
router.post('/', validateRequest(createTaskSchema), createTaskController)
router.get('/:id', validateRequest(taskIdSchema), getTaskController)
router.patch('/:id', validateRequest(updateTaskSchema), updateTaskController)
router.delete('/:id', validateRequest(taskIdSchema), deleteTaskController)
router.patch('/:id/toggle', validateRequest(taskIdSchema), toggleTaskController)

export default router

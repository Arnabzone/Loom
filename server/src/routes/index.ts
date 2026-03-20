import { Router } from 'express'
import authRoutes from './auth.routes.js'
import taskRoutes from './task.routes.js'
import { sendResponse } from '../utils/response.js'

const router = Router()

router.get('/health', (_req, res) => sendResponse(res, 200, { status: 'ok' }, 'API healthy'))
router.use('/auth', authRoutes)
router.use('/tasks', taskRoutes)

export default router

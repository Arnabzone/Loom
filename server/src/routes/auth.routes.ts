import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from '../controllers/auth.controller.js'
import { validateRequest } from '../middlewares/validate-request.js'
import { loginSchema, refreshSchema, registerSchema } from '../validators/auth.validator.js'

const router = Router()

router.post('/register', validateRequest(registerSchema), registerController)
router.post('/login', validateRequest(loginSchema), loginController)
router.post('/refresh', validateRequest(refreshSchema), refreshController)
router.post('/logout', logoutController)

export default router

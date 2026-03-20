import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'express-async-errors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js'
import routes from './routes/index.js'

export const app = express()

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)
app.use(
  pinoHttp({
    logger,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use(routes)
app.use(notFoundHandler)
app.use(errorHandler)

import type { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { logger } from '../config/logger.js'
import { ApiError } from '../utils/api-error.js'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    data: null,
    message: 'Route not found',
  })
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({ err: error, path: req.path }, 'Unhandled error')

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      data: error.details ?? null,
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: error.flatten(),
      message: 'Validation error',
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: null,
      message: 'A resource with this value already exists',
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    data: null,
    message: 'Internal server error',
  })
}

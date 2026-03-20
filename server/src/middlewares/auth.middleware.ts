import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.js'
import { verifyAccessToken } from '../utils/token.js'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authorization token is missing'))
  }

  try {
    req.user = verifyAccessToken(authHeader.slice(7))
    next()
  } catch {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired access token'))
  }
}

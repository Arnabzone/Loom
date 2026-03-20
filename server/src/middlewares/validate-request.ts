import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { AnyZodObject } from 'zod'
import { ApiError } from '../utils/api-error.js'

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!parsed.success) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Validation error', parsed.error.flatten()))
    }

    req.body = parsed.data.body
    req.params = parsed.data.params
    req.query = parsed.data.query
    next()
  }
}

import type { Response } from 'express'

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  data: T,
  message = 'Request successful',
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  })
}

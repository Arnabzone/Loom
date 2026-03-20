import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env, isProduction } from '../config/env.js'
import { loginUser, logoutUser, refreshUserToken, registerUser } from '../services/auth.service.js'
import { sendResponse } from '../utils/response.js'

const refreshCookieName = 'loom_refresh_token'

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: '/auth',
  })
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/auth',
  })
}

export async function registerController(req: Request, res: Response) {
  const result = await registerUser(req.body)
  setRefreshCookie(res, result.refreshToken)

  return sendResponse(
    res,
    StatusCodes.CREATED,
    {
      user: result.user,
      accessToken: result.accessToken,
    },
    'User registered successfully',
  )
}

export async function loginController(req: Request, res: Response) {
  const result = await loginUser(req.body)
  setRefreshCookie(res, result.refreshToken)

  return sendResponse(
    res,
    StatusCodes.OK,
    {
      user: result.user,
      accessToken: result.accessToken,
    },
    'Login successful',
  )
}

export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies[refreshCookieName] ?? req.body.refreshToken
  const result = await refreshUserToken(refreshToken)
  setRefreshCookie(res, result.refreshToken)

  return sendResponse(
    res,
    StatusCodes.OK,
    {
      user: result.user,
      accessToken: result.accessToken,
    },
    'Access token refreshed successfully',
  )
}

export async function logoutController(req: Request, res: Response) {
  const refreshToken = req.cookies[refreshCookieName] ?? req.body.refreshToken
  await logoutUser(refreshToken)
  clearRefreshCookie(res)

  return sendResponse(res, StatusCodes.OK, null, 'Logout successful')
}

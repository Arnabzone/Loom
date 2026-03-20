import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../prisma/client.js'
import { ApiError } from '../utils/api-error.js'
import {
  getRefreshTokenExpiryDate,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js'

function sanitizeUser(user: { id: string; name: string; email: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

async function persistRefreshToken(userId: string, refreshToken: string) {
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId,
      expiresAt: getRefreshTokenExpiryDate(),
    },
  })
}

async function revokeStoredRefreshToken(refreshToken: string) {
  const tokenHash = hashToken(refreshToken)

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })
}

async function buildAuthPayload(user: { id: string; name: string; email: string }) {
  const jwtPayload = { userId: user.id, email: user.email }
  const accessToken = signAccessToken(jwtPayload)
  const refreshToken = signRefreshToken(jwtPayload)

  await persistRefreshToken(user.id, refreshToken)

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  }
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  })

  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is already registered')
  }

  const passwordHash = await bcrypt.hash(payload.password, 12)
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  return buildAuthPayload(user)
}

export async function loginUser(payload: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  })

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash)
  if (!passwordMatches) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
  }

  return buildAuthPayload(user)
}

export async function refreshUserToken(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken)
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        tokenHash: hashToken(refreshToken),
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!storedToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token is invalid or expired')
    }

    await revokeStoredRefreshToken(refreshToken)
    return buildAuthPayload(storedToken.user)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token is invalid or expired')
  }
}

export async function logoutUser(refreshToken?: string) {
  if (!refreshToken) {
    return
  }

  await revokeStoredRefreshToken(refreshToken)
}

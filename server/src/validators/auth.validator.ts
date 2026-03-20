import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
})

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
})

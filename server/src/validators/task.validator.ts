import { z } from 'zod'

const taskStatusSchema = z.enum(['todo', 'in-progress', 'done'])
const taskPrioritySchema = z.enum(['low', 'medium', 'high'])
const taskFilterStatusSchema = z.enum(['todo', 'in-progress', 'done', 'pending', 'completed'])

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).default(''),
    status: taskStatusSchema.default('todo'),
    priority: taskPrioritySchema.default('medium'),
    dueDate: z.string().datetime().or(z.string().date()).nullable().optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
})

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: z.string().datetime().or(z.string().date()).nullable().optional(),
  }).refine((value) => Object.keys(value).length > 0, { message: 'At least one field is required' }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).default({}),
})

export const taskIdSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).default({}),
})

export const listTasksSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: taskFilterStatusSchema.optional(),
    search: z.string().trim().max(200).optional(),
  }),
})

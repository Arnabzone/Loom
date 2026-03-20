import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { prisma } from './prisma/client.js'

async function bootstrap() {
  await prisma.$connect()

  app.listen(env.PORT, () => {
    logger.info(`Loom API running on port ${env.PORT}`)
  })
}

bootstrap().catch(async (error) => {
  logger.error(error, 'Failed to bootstrap server')
  await prisma.$disconnect()
  process.exit(1)
})

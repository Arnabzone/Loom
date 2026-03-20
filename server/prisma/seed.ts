import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@loom.app' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@loom.app',
      passwordHash,
    },
  })

  await prisma.task.createMany({
    data: [
      {
        title: 'Design landing visuals',
        description: 'Polish illustrations and hero layout.',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 86_400_000 * 2),
        userId: user.id,
      },
      {
        title: 'Connect auth flow',
        description: 'Hook login and register pages to API.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 86_400_000 * 4),
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

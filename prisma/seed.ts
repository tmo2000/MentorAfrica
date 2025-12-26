import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@mentor.test' },
    update: {},
    create: {
      email: 'admin@mentor.test',
      password,
      role: 'ADMIN'
    }
  })

  await prisma.user.upsert({
    where: { email: 'mentor@mentor.test' },
    update: {},
    create: {
      email: 'mentor@mentor.test',
      password,
      role: 'MENTOR'
    }
  })

  await prisma.user.upsert({
    where: { email: 'mentee@mentor.test' },
    update: {},
    create: {
      email: 'mentee@mentor.test',
      password,
      role: 'MENTEE'
    }
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

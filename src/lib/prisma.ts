// import { PrismaClient } from '@/generated/prisma/client'
// import { PrismaMariaDb } from '@prisma/adapter-mariadb'


// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


// import 'dotenv/config'
// import { PrismaClient } from '../generated/prisma/client'

// const adapter = new PrismaMariaDb(
//   {
//     host: "localhost",
//     port: 3306,
//     connectionLimit: 5
//   },
//   { schema: 'mySchemaName' } // Optional: specify the default schema/database
// )
// const prisma = new PrismaClient({ adapter })

// createdAt DateTime @default(now())
// updatedAt DateTime @updatedAt

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 从环境变量解析连接信息
const dbUrl = new URL(process.env.DATABASE_URL || 'mysql://root@localhost:3306/db')

// 创建 adapter
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // 移除开头的 '/'
  connectionLimit: 10,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { serializeBigInt } from '@/lib/utils'

// POST: 批量添加 poetry，按 name 判断是否已存在，已存在则跳过
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: '没有待添加的数据',
        added: 0,
        skipped: 0,
        data: { added: [], skippedNames: [] },
      })
    }

    const namesToAdd = [...new Set(items.map((i: { name?: string }) => i.name).filter(Boolean))] as string[]

    if (namesToAdd.length === 0) {
      return NextResponse.json({
        success: true,
        message: '没有有效的 name，无法添加',
        added: 0,
        skipped: items.length,
        data: { added: [], skippedNames: [] },
      })
    }

    const existing = await prisma.poetry.findMany({
      where: { name: { in: namesToAdd } },
      select: { name: true },
    })
    const existingNames = new Set(existing.map((e) => e.name).filter(Boolean) as string[])

    const toAdd: { name: string; description: string | null }[] = []
    const seenInBatch = new Set<string>()
    for (const item of items) {
      const name = typeof item.name === 'string' ? item.name.trim() : ''
      if (!name || existingNames.has(name) || seenInBatch.has(name)) continue
      seenInBatch.add(name)
      toAdd.push({
        name,
        description: item.description != null ? String(item.description) : null,
      })
    }

    let created: { id: number; name: string | null; description: string | null }[] = []
    if (toAdd.length > 0) {
        await prisma.poetry.createMany({
            data: toAdd,
          })
        created = await prisma.poetry.findMany({
        where: { name: { in: toAdd.map((i) => i.name) } },
        orderBy: { id: 'desc' },
        take: toAdd.length,
        })
    }

    const skippedCount = items.length - toAdd.length

    return NextResponse.json(
      {
        success: true,
        message: `批量添加完成：新增 ${created.length} 条，跳过 ${skippedCount} 条（已存在或本批重复）`,
        added: created.length,
        skipped: skippedCount,
        data: {
          added: serializeBigInt(created),
          skippedNames: [...existingNames],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '批量添加失败',
      },
      { status: 500 }
    )
  }
}
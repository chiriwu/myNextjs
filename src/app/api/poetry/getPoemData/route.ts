// src/app/api/poetry/getPoemData/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { serializeBigInt } from '@/lib/utils'

// POST，body 里传 page、pageSize、name
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const page = Math.max(1, parseInt(body.page) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(body.pageSize) || 10))
    const name = typeof body.name === 'string' ? body.name.trim() : undefined

    const where = name
      ? { name: { contains: name } }
      : {}

    const skip = (page - 1) * pageSize

    const [poetries, total] = await Promise.all([
      prisma.poetry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
      }),
      prisma.poetry.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: serializeBigInt(poetries),
      count: poetries.length,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 辅助函数：处理 BigInt 序列化
export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString() as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt) as T
  }
  
  if (typeof obj === 'object') {
    const serialized: Record<string, unknown> = {}
    for (const key in obj) {
      serialized[key] = serializeBigInt(obj[key])
    }
    return serialized as T
  }
  
  return obj
}
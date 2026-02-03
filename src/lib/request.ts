import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/** 接口通用响应结构 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  [key: string]: unknown
}

/** 创建 axios 实例时的 baseURL */
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '' // 浏览器端使用相对路径，走同源
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

const request: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可在此添加 token：config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse
    if (res?.success === false && res?.error) {
      return Promise.reject(new Error(res.error || '请求失败'))
    }
    return response.data
  },
  (error) => {
    const message = error.response?.data?.error ?? error.message ?? '网络错误'
    return Promise.reject(new Error(message))
  }
)

export default request

/** GET */
export function get<T = unknown>(url: string, params?: Record<string, unknown>) {
  return request.get<ApiResponse<T>>(url, { params }).then((res) => res as unknown as ApiResponse<T>)
}

/** POST */
export function post<T = unknown>(url: string, data?: unknown) {
  return request.post<ApiResponse<T>>(url, data).then((res) => res as unknown as ApiResponse<T>)
}

/** PUT */
export function put<T = unknown>(url: string, data?: unknown) {
  return request.put<ApiResponse<T>>(url, data).then((res) => res as unknown as ApiResponse<T>)
}

/** DELETE */
export function del<T = unknown>(url: string, params?: Record<string, unknown>) {
  return request.delete<ApiResponse<T>>(url, { params }).then((res) => res as unknown as ApiResponse<T>)
}
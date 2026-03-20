import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/src/store/useAuthStore'
import type { ApiResponse, AuthPayload } from '@/src/types'

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
})

let refreshPromise: Promise<string | null> | null = null

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableRequest | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = api
          .post<ApiResponse<AuthPayload>>('/auth/refresh')
          .then((response) => {
            const { user, accessToken } = response.data.data
            useAuthStore.getState().login(user, accessToken)
            return accessToken
          })
          .catch(() => {
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return null
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const nextToken = await refreshPromise
      if (nextToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${nextToken}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

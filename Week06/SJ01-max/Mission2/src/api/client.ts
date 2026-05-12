import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { Comment, CommentListData, LpDetail, LpListData, SortOrder } from '../types/lp'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
}

export const AUTH_TOKENS_KEY = 'auth_tokens'

export function getStoredAuthTokens(): AuthTokens | null {
  try {
    const stored = localStorage.getItem(AUTH_TOKENS_KEY)
    if (stored) {
      const raw = JSON.parse(stored)
      const accessToken = raw.accessToken ?? raw.access_token ?? ''
      const refreshToken = raw.refreshToken ?? raw.refresh_token ?? ''
      if (accessToken) return { accessToken, refreshToken }
    }
    // 개별 키 fallback (이전 형식 호환)
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      return { accessToken, refreshToken: localStorage.getItem('refreshToken') ?? '' }
    }
    return null
  } catch {
    return null
  }
}

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
})

// 요청 인터셉터: accessToken 자동 주입
apiClient.interceptors.request.use((config) => {
  const tokens = getStoredAuthTokens()
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  return config
})

// 토큰 갱신 중 대기 큐
let isRefreshing = false

type QueueEntry = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}
let refreshQueue: QueueEntry[] = []

function processQueue(error: unknown, newToken: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(newToken!)
  })
  refreshQueue = []
}

function clearTokensAndRedirect() {
  localStorage.removeItem(AUTH_TOKENS_KEY)
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.replace('/login')
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// 응답 인터셉터: 401 → 자동 토큰 갱신 후 재시도
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // refresh 엔드포인트 자체가 401 → refresh 토큰도 만료 → 로그아웃
    if (originalRequest.url?.includes('/auth/refresh')) {
      processQueue(error, null)
      isRefreshing = false
      clearTokensAndRedirect()
      return Promise.reject(error)
    }

    // 이미 재시도한 요청이면 무한 루프 방지
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    // 다른 요청이 refresh 중이면 큐에 등록 후 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    // 최초 401: refresh 토큰으로 갱신 시도
    originalRequest._retry = true
    isRefreshing = true

    try {
      const tokens = getStoredAuthTokens()
      if (!tokens?.refreshToken) throw new Error('저장된 토큰 없음')

      const { data } = await apiClient.post('/auth/refresh', {
        refresh: tokens.refreshToken,
      })
      const newTokens = data.data as AuthTokens

      localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(newTokens))

      processQueue(null, newTokens.accessToken)
      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearTokensAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

// ── 인증 ─────────────────────────────────────────────────

export async function apiSignup(payload: { name: string; email: string; password: string }) {
  await apiClient.post('/auth/signup', payload)
}

export async function apiSignin(payload: { email: string; password: string }) {
  const { data } = await apiClient.post('/auth/signin', payload)
  const raw = data.data
  return {
    accessToken: raw.accessToken ?? raw.access_token,
    refreshToken: raw.refreshToken ?? raw.refresh_token,
  } as AuthTokens
}

export async function apiSignout() {
  await apiClient.post('/auth/signout')
}

export async function apiGetMe() {
  const { data } = await apiClient.get('/users/me')
  return data.data as User
}

// ── LP ───────────────────────────────────────────────────

export async function fetchLps(order: SortOrder = 'desc', cursor = 0, signal?: AbortSignal) {
  const { data } = await apiClient.get('/lps', {
    params: { order, cursor, limit: 20 },
    signal,
  })
  return data.data as LpListData
}

export async function fetchLp(lpId: number, signal?: AbortSignal) {
  const { data } = await apiClient.get(`/lps/${lpId}`, { signal })
  return data.data as LpDetail
}

export async function fetchLpComments(
  lpId: number,
  order: SortOrder = 'desc',
  cursor = 0,
  signal?: AbortSignal,
) {
  const { data } = await apiClient.get(`/lps/${lpId}/comments`, {
    params: { order, cursor, limit: 10 },
    signal,
  })
  return data.data as CommentListData
}

export async function createLpComment(lpId: number, content: string) {
  const { data } = await apiClient.post(`/lps/${lpId}/comments`, { content })
  return data.data as Comment
}

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return '알 수 없는 오류가 발생했습니다.'

  const status = error.response?.status
  const message =
    typeof error.response?.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data
      ? String(error.response.data.message)
      : error.message

  return status ? `${status}: ${message}` : message
}

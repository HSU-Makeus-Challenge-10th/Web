import axios from 'axios'
import type { LpDetail, LpListData, SortOrder } from '../types/lp'

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

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(AUTH_TOKENS_KEY)
    if (stored) {
      const { accessToken } = JSON.parse(stored) as AuthTokens
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  } catch { /* 파싱 오류 무시 */ }
  return config
})

// ── 인증 ─────────────────────────────────────────────────

export async function apiSignup(payload: { name: string; email: string; password: string }) {
  await apiClient.post('/auth/signup', payload)
}

export async function apiSignin(payload: { email: string; password: string }) {
  const { data } = await apiClient.post('/auth/signin', payload)
  return data.data as AuthTokens
}

export async function apiSignout() {
  await apiClient.post('/auth/signout')
}

export async function apiGetMe() {
  const { data } = await apiClient.get('/users/me')
  return data.data as User
}

// ── LP ───────────────────────────────────────────────────

export async function fetchLps(order: SortOrder = 'desc', signal?: AbortSignal) {
  const { data } = await apiClient.get('/lps', {
    params: { order, limit: 20 },
    signal,
  })
  return data.data as LpListData
}

export async function fetchLp(lpId: number, signal?: AbortSignal) {
  const { data } = await apiClient.get(`/lps/${lpId}`, { signal })
  return data.data as LpDetail
}

import axios from 'axios'
import type { Comment, LpDetail, LpListData, SortOrder } from '../types/lp'

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

export async function apiWithdraw() {
  await apiClient.delete('/users')
}

export async function apiGetMe() {
  const { data } = await apiClient.get('/users/me')
  return data.data as User
}

export async function apiUpdateMe(payload: { name?: string; bio?: string | null; avatar?: string | null }) {
  const { data } = await apiClient.patch('/users', payload)
  return data.data as User
}

// ── 파일 업로드 ────────────────────────────────────────────

export async function apiUploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data.imageUrl as string
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

export async function apiCreateLp(payload: {
  title: string
  content: string
  thumbnail?: string | null
  tags: string[]
  published: boolean
}) {
  const { data } = await apiClient.post('/lps', payload)
  return data.data as LpDetail
}

export async function apiUpdateLp(
  id: number,
  payload: { title?: string; content?: string; thumbnail?: string | null; published?: boolean },
) {
  const { data } = await apiClient.patch(`/lps/${id}`, payload)
  return data.data as LpDetail
}

export async function apiDeleteLp(id: number) {
  await apiClient.delete(`/lps/${id}`)
}

export async function apiLikeLp(lpId: number) {
  const { data } = await apiClient.post(`/lps/${lpId}/likes`)
  return data.data
}

export async function apiUnlikeLp(lpId: number) {
  const { data } = await apiClient.delete(`/lps/${lpId}/likes`)
  return data.data
}

// ── 댓글 ─────────────────────────────────────────────────

export async function fetchComments(lpId: number, order: SortOrder = 'desc', signal?: AbortSignal) {
  const { data } = await apiClient.get(`/lps/${lpId}/comments`, {
    params: { order },
    signal,
  })
  return data.data.data as Comment[]
}

export async function apiCreateComment(lpId: number, content: string) {
  const { data } = await apiClient.post(`/lps/${lpId}/comments`, { content })
  return data.data as Comment
}

export async function apiUpdateComment(lpId: number, commentId: number, content: string) {
  const { data } = await apiClient.patch(`/lps/${lpId}/comments/${commentId}`, { content })
  return data.data as Comment
}

export async function apiDeleteComment(lpId: number, commentId: number) {
  await apiClient.delete(`/lps/${lpId}/comments/${commentId}`)
}

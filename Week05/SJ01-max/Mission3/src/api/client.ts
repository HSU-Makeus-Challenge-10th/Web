import axios, { type InternalAxiosRequestConfig } from 'axios'

// ── 타입 ──────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const AUTH_TOKENS_KEY = 'auth_tokens'

// ── Axios 인스턴스 ─────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
})

// ── 요청 인터셉터: accessToken 자동 주입 ──────────────────────

apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(AUTH_TOKENS_KEY)
    if (stored) {
      const { accessToken } = JSON.parse(stored) as AuthTokens
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  } catch {
    // 파싱 오류 시 통과
  }
  return config
})

// ── Race Condition 방지용 상태 ────────────────────────────────
// 동시에 여러 요청이 401을 받아도 refresh는 딱 한 번만 실행한다.
// 나머지 요청들은 refreshQueue에 쌓여 있다가 refresh 완료 후 재시도된다.

let isRefreshing = false

type QueueEntry = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}
let refreshQueue: QueueEntry[] = []

/** 큐에 쌓인 모든 요청을 처리한다. */
function processQueue(error: unknown, newToken: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(newToken!)
  })
  refreshQueue = []
}

/** 토큰 삭제 후 로그인 페이지로 이동 (Context 밖에서 호출되므로 직접 이동) */
function clearTokensAndRedirect() {
  localStorage.removeItem(AUTH_TOKENS_KEY)
  window.location.replace('/login')
}

// ── 응답 인터셉터: 401 → 자동 토큰 갱신 ─────────────────────

// _retry 플래그를 위한 타입 확장
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

apiClient.interceptors.response.use(
  (response) => response, // 2xx: 그대로 반환

  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig

    // ① 401이 아니거나 config가 없으면 즉시 실패
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // ② refresh 엔드포인트 자체가 401이면 → refresh 토큰도 만료됨 → 로그아웃
    if (originalRequest.url?.includes('/auth/refresh')) {
      processQueue(error, null)
      isRefreshing = false
      clearTokensAndRedirect()
      return Promise.reject(error)
    }

    // ③ 이미 재시도한 요청이면 무한 루프 방지를 위해 즉시 실패
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    // ④ 현재 다른 요청이 refresh 중이면 → 큐에 등록 후 대기
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

    // ⑤ 최초 401: refresh 토큰으로 갱신 시도
    originalRequest._retry = true
    isRefreshing = true

    try {
      const stored = localStorage.getItem(AUTH_TOKENS_KEY)
      if (!stored) throw new Error('저장된 토큰 없음')

      const { refreshToken } = JSON.parse(stored) as AuthTokens

      // POST /auth/refresh — body 필드명은 반드시 'refresh'
      const { data } = await apiClient.post('/auth/refresh', {
        refresh: refreshToken,
      })
      const newTokens = data.data as AuthTokens

      // 새 토큰을 localStorage에 저장
      localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(newTokens))

      // 큐에 쌓인 요청들에게 새 accessToken 전달
      processQueue(null, newTokens.accessToken)

      // 원래 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      // refresh 실패 → 큐 정리 + 로그아웃
      processQueue(refreshError, null)
      clearTokensAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

// ── 인증 API ─────────────────────────────────────────────

export interface SignupPayload {
  email: string
  password: string
  name: string
}

export interface SigninPayload {
  email: string
  password: string
}

// signup은 유저 정보만 반환 (토큰 없음) → 회원가입 후 signin을 별도 호출
export async function apiSignup(payload: SignupPayload) {
  await apiClient.post('/auth/signup', payload)
}

export async function apiSignin(payload: SigninPayload) {
  const { data } = await apiClient.post('/auth/signin', payload)
  return data.data as AuthTokens
}

export async function apiSignout() {
  await apiClient.post('/auth/signout')
}

// ── 유저 API ─────────────────────────────────────────────

export interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
}

export async function apiGetMe() {
  const { data } = await apiClient.get('/users/me')
  return data.data as User
}

import axios from 'axios'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const AUTH_TOKENS_KEY = 'auth_tokens'

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
})

// 요청마다 localStorage에서 accessToken을 꺼내 Authorization 헤더에 주입
apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(AUTH_TOKENS_KEY)
    if (stored) {
      const tokens = JSON.parse(stored) as AuthTokens
      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    }
  } catch {
    // 파싱 오류 시 그냥 통과
  }
  return config
})

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

// signup은 유저 정보만 반환 (토큰 없음) → 회원가입 후 signin을 별도 호출해야 함
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

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from '@/features/auth/authSlice'

/** JS 접근 가능한 XSRF-TOKEN 쿠키를 읽는 헬퍼 */
const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

// ─── 1. 기본 fetchBaseQuery ────────────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:8072',
  credentials: 'include', // accessToken · refreshToken HttpOnly 쿠키 자동 전송
  prepareHeaders: (headers) => {
    // CSRF Token → X-XSRF-TOKEN (POST/PUT/DELETE 필수, JS readable 쿠키)
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken)
    }
    return headers
  },
})

// ─── 2. withReauth 래퍼 ───────────────────────────────────────────────────────
// Gateway가 accessToken 검사 + refreshToken 자동 갱신을 담당한다.
// 프론트로 401이 도달한 경우 = Gateway 갱신까지 실패한 상태 → 로그아웃만 처리.

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    api.dispatch(logout())
  }

  return result
}

export default baseQuery

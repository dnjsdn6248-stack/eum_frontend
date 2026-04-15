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

const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // accessToken 만료 → refreshToken 쿠키로 갱신 시도
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    )

    if (!refreshResult.error) {
      // 갱신 성공 → 백엔드가 Set-Cookie로 새 쿠키 자동 저장 → 원본 요청 재시도
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      // 갱신 실패(refreshToken 만료) → 즉시 로그아웃 (무한루프 방지)
      api.dispatch(logout())
    }
  }

  return result
}

export default baseQuery

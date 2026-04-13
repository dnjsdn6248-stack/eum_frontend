import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setAccessToken, logout } from '@/features/auth/authSlice'

/** HttpOnly가 아닌 쿠키(XSRF-TOKEN)를 읽는 헬퍼 */
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

// ─── 1. 기본 fetchBaseQuery ────────────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  credentials: 'include',  // refreshToken HttpOnly 쿠키 자동 전송
  prepareHeaders: (headers, { getState }) => {
    // Access Token → Authorization: Bearer (메모리에서 읽음)
    const token = getState().auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    // CSRF Token → X-XSRF-TOKEN (POST/PUT/DELETE 필수, JS readable 쿠키)
    const csrfToken = getCookie('XSRF-TOKEN')
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
    // Access Token 만료 → Refresh Token으로 갱신 시도
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // 갱신 성공 → 새 accessToken 메모리 저장 후 원본 요청 재시도
      api.dispatch(setAccessToken(refreshResult.data.accessToken))
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      // 갱신 실패(Refresh Token 만료) → 즉시 로그아웃 (무한루프 방지)
      api.dispatch(logout())
    }
  }

  return result
}

export default baseQuery

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setToken, clearCredentials } from '@/features/auth/authSlice'

/**
 * RTK Query 전용 baseQuery
 *
 * ① prepareHeaders  - Redux store의 accessToken을 Bearer 헤더에 자동 주입
 * ② baseQueryWithReauth - 401 응답 시 /auth/refresh 로 토큰 갱신 후 원본 요청 재시도.
 *    갱신 실패 시 자격증명 초기화 후 /login 으로 리다이렉트.
 */

// ─── 1. 기본 fetchBaseQuery ────────────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  credentials: 'include',  // Refresh Token 쿠키 전송을 위해 필요
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// ─── 2. 토큰 재발급 래퍼 ──────────────────────────────────────────────────────

const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // Access Token 만료 → Refresh 시도
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // 새 토큰 저장 후 원본 요청 재시도
      const newToken = refreshResult.data.accessToken
      api.dispatch(setToken(newToken))
      localStorage.setItem('accessToken', newToken)
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      // Refresh 실패 → 로그아웃 처리
      api.dispatch(clearCredentials())
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
  }

  return result
}

export default baseQuery

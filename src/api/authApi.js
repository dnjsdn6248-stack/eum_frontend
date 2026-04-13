import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'
import { setUser, setAccessToken, setInitialized, logout } from '@/features/auth/authSlice'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({

    // ─── CSRF 초기화 ────────────────────────────────────────────────────────────

    /** 앱 최초 로드 시 1회 호출 → XSRF-TOKEN 쿠키 발급 */
    getCsrf: builder.query({
      query: () => ({ url: '/csrf' }),
    }),

    // ─── 인증 Mutations ─────────────────────────────────────────────────────────

    /**
     * POST /auth/login
     * 응답: { accessToken }  (refreshToken은 HttpOnly 쿠키로 자동 저장)
     * 로그인 성공 후 /auth/me를 호출하여 user 정보를 Redux에 저장
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAccessToken(data.accessToken))
          // accessToken이 Redux에 저장된 후 user 정보 조회
          dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
        } catch {}
      },
    }),

    /** POST /auth/signup — 약관 동의 포함 */
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    /** POST /auth/logout — 서버에서 refreshToken 쿠키 삭제 */
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(logout())
        }
      },
    }),

    /** PUT /auth/profile — 프로필 수정 */
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/auth/profile', method: 'PUT', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
        } catch {}
      },
    }),

    /** PUT /auth/password — 비밀번호 변경 */
    changePassword: builder.mutation({
      query: (body) => ({ url: '/auth/password', method: 'PUT', body }),
    }),

    // ─── 이메일 인증 Mutations ──────────────────────────────────────────────────

    /** POST /auth/email/send — 인증 코드 발송 */
    sendEmailVerify: builder.mutation({
      query: (email) => ({
        url: '/auth/email/send',
        method: 'POST',
        params: { email },
      }),
    }),

    /** POST /auth/email/verify — 인증 코드 확인 */
    verifyEmail: builder.mutation({
      query: ({ email, code }) => ({
        url: '/auth/email/verify',
        method: 'POST',
        params: { email, code },
      }),
    }),

    // ─── 인증 Queries ───────────────────────────────────────────────────────────

    /**
     * GET /auth/me — 로그인 사용자 정보 조회
     * AuthInitializer 마운트 시 자동 호출.
     * 새로고침 → 401 → withReauth → /auth/refresh → 재시도
     */
    getMe: builder.query({
      query: () => ({ url: '/auth/me' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
        } catch {
          dispatch(setUser(null))
        } finally {
          dispatch(setInitialized())
        }
      },
    }),

    /** GET /auth/terms — 약관 목록 조회 (인증 불필요) */
    getTerms: builder.query({
      query: () => ({ url: '/auth/terms' }),
    }),

  }),
})

export const {
  useGetCsrfQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSendEmailVerifyMutation,
  useVerifyEmailMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetTermsQuery,
} = authApi

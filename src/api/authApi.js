import { apiSlice } from './apiSlice'
import { logout } from '@/features/auth/authSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ─── CSRF 초기화 ────────────────────────────────────────────────────────────

    /** 앱 최초 로드 시 1회 호출 → XSRF-TOKEN 쿠키 발급 */
    getCsrf: builder.query({
      query: () => ({ url: '/api/v1/csrf' }),
    }),

    // ─── 인증 Mutations ─────────────────────────────────────────────────────────

    /**
     * POST /auth/login
     * accessToken · refreshToken 모두 HttpOnly 쿠키로 자동 저장
     * 로그인 성공 후 /auth/me를 강제 재호출하여 캐시 갱신
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
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

    /** POST /auth/logout — 서버에서 쿠키 삭제 */
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

    /** PUT /users/profile — 프로필 수정 */
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
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
     * RTK Query 캐시가 단일 출처 → useAuth()가 직접 구독
     * 새로고침 → 401 → withReauth → /auth/refresh → 재시도
     */
    getMe: builder.query({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['Auth'],
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

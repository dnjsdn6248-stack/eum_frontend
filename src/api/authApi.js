import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

// ─── Auth Redux Slice ─────────────────────────────────────────────────────────
// user 상태는 RTK Query의 getMe 캐시가 단일 출처.
// logout 액션은 store.js의 logoutMiddleware가 getMe 캐시를 초기화한다.
const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    /** API 401 또는 로그아웃 시 호출 → logoutMiddleware가 getMe 캐시 초기화 */
    logout() {},
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ─── CSRF 초기화 ────────────────────────────────────────────────────────────

    /** 앱 최초 로드 시 1회 호출 → XSRF-TOKEN 쿠키 발급 */
    getCsrf: builder.query({
      query: () => ({ url: "/csrf" }),
    }),

    // ─── 인증 Mutations ─────────────────────────────────────────────────────────

    /**
     * POST /auth/login
     * accessToken · refreshToken 모두 HttpOnly 쿠키로 자동 저장
     * 로그인 성공 후 /users/me를 강제 재호출하여 캐시 갱신
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }),
          );
        } catch {}
      },
    }),

    /** POST /auth/signup — 약관 동의 포함 */
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    /** POST /auth/logout — 서버에서 쿠키 삭제 */
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
    }),

    // ─── 이메일 인증 Mutations ──────────────────────────────────────────────────

    /** POST /auth/email/send?email= — 인증 코드 발송 */
    sendEmailVerify: builder.mutation({
      query: (email) => ({
        url: "/auth/email/send",
        method: "POST",
        params: { email },
      }),
    }),

    /** POST /auth/email/verify?email=&code= — 인증 코드 확인 */
    verifyEmail: builder.mutation({
      query: ({ email, code }) => ({
        url: "/auth/email/verify",
        method: "POST",
        params: { email, code },
      }),
    }),

    // ─── 소셜 계정 연동 ─────────────────────────────────────────────────────────

    /** GET /auth/social/accounts — 연동된 소셜 계정 목록 조회 */
    getSocialAccounts: builder.query({
      query: () => ({ url: "/auth/social/accounts" }),
      providesTags: ["Auth"],
    }),

    /**
     * GET /auth/social/link/start?provider= — 소셜 계정 연동 시작
     * 응답의 authUrl로 브라우저를 이동시켜야 한다
     */
    startSocialLink: builder.query({
      query: (provider) => ({
        url: "/auth/social/link/start",
        params: { provider },
      }),
    }),

    /** DELETE /auth/social/unlink?provider= — 소셜 계정 연동 해제 */
    unlinkSocial: builder.mutation({
      query: (provider) => ({
        url: "/auth/social/unlink",
        method: "DELETE",
        params: { provider },
      }),
      invalidatesTags: ["Auth"],
    }),

    // ─── 인증 Queries ───────────────────────────────────────────────────────────

    /**
     * GET /users/me — 로그인 사용자 기본 정보 조회 (구 /auth/me 대체)
     * RTK Query 캐시가 단일 출처 → useAuth()가 직접 구독
     * 새로고침 → 401 → Gateway가 refreshToken으로 자동 갱신 시도 → 실패 시 logout
     * 응답: { status, data: { userId, name, email, phoneNumber, smsAllowed, emailAllowed, updatedAt } }
     */
    getMe: builder.query({
      query: () => ({ url: "/users/me" }),
      transformResponse: (res) => res.data,
      providesTags: ["Auth"],
    }),

    /** GET /auth/terms — 약관 목록 조회 (인증 불필요) */
    getTerms: builder.query({
      query: () => ({ url: "/auth/terms" }),
    }),
  }),
});

export const {
  useGetCsrfQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useSendEmailVerifyMutation,
  useVerifyEmailMutation,
  useGetSocialAccountsQuery,
  useLazyStartSocialLinkQuery,
  useUnlinkSocialMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetTermsQuery,
} = authApi;

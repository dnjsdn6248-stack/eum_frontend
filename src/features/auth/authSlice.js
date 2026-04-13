import { createSlice } from '@reduxjs/toolkit'

/**
 * authSlice — 클라이언트 인증 상태 관리
 *
 * - accessToken: 메모리(JS 변수)에만 저장. localStorage/sessionStorage 금지.
 * - refreshToken: 서버가 HttpOnly 쿠키로 관리. JS 접근 불가.
 * - user: /auth/me 응답으로 채움.
 */

const initialState = {
  user: null,
  accessToken: null,    // 메모리 전용 — 새로고침 시 withReauth가 /auth/refresh로 복원
  isInitialized: false, // AuthInitializer 완료 신호
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** /auth/me 성공 시 user 저장 */
    setUser(state, action) {
      state.user = action.payload
    },

    /** 로그인·/auth/refresh 성공 시 accessToken 메모리 저장 */
    setAccessToken(state, action) {
      state.accessToken = action.payload
    },

    /** AuthInitializer의 getMe finally 블록에서 반드시 호출 */
    setInitialized(state) {
      state.isInitialized = true
    },

    /** 로그아웃 또는 withReauth 갱신 실패 시 호출 */
    logout(state) {
      state.user = null
      state.accessToken = null
    },
  },
})

export const { setUser, setAccessToken, setInitialized, logout } = authSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentUser   = (state) => state.auth.user
export const selectAccessToken   = (state) => state.auth.accessToken
export const selectIsInitialized = (state) => state.auth.isInitialized
export const selectIsLoggedIn    = (state) => state.auth.user !== null
export const selectIsAdmin       = (state) => state.auth.user?.role === 'ROLE_ADMIN'

export default authSlice.reducer

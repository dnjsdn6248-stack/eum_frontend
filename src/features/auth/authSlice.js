import { createSlice } from '@reduxjs/toolkit'

/**
 * authSlice — 클라이언트 인증 상태만 관리
 *
 * 서버 통신(login, logout, getMe 등)은 authApi(RTK Query)가 담당하며,
 * onQueryStarted 콜백에서 setCredentials / clearCredentials를 dispatch해
 * 이 슬라이스를 업데이트합니다.
 *
 * loading / error 상태는 RTK Query가 반환하는 isLoading / error로 대체됩니다.
 */

const initialState = {
  /** @type {{ id: number, email: string, name: string, role: 'USER'|'ADMIN', profileImage: string|null } | null} */
  user: null,
  accessToken: localStorage.getItem('accessToken') ?? null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** login / updateProfile 성공 후 authApi.onQueryStarted에서 호출 */
    setCredentials(state, action) {
      const { user, accessToken } = action.payload
      if (user !== undefined) state.user = user
      if (accessToken !== undefined) {
        state.accessToken     = accessToken
        state.isAuthenticated = true
      }
    },

    /** logout / 토큰 만료 시 authApi.onQueryStarted 또는 axiosInstance 인터셉터에서 호출 */
    clearCredentials(state) {
      state.user            = null
      state.accessToken     = null
      state.isAuthenticated = false
    },

    /** axiosInstance 토큰 갱신 인터셉터에서 호출 (기존 호환 유지) */
    setToken(state, action) {
      state.accessToken     = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
})

export const { setCredentials, clearCredentials, setToken } = authSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAuth            = (state) => state.auth
export const selectCurrentUser     = (state) => state.auth.user
export const selectAccessToken     = (state) => state.auth.accessToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsAdmin         = (state) => state.auth.user?.role === 'ADMIN'

export default authSlice.reducer

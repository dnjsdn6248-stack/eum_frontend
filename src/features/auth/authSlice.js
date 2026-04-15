import { createSlice } from '@reduxjs/toolkit'

/**
 * authSlice — logout 액션 전용
 *
 * user 상태는 RTK Query의 getMe 캐시가 단일 출처.
 * logout 액션은 store.js의 logoutMiddleware가 getMe 캐시를 초기화한다.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    /** withReauth 실패 또는 로그아웃 시 호출 → logoutMiddleware가 캐시 초기화 */
    logout() {},
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

import { useGetMeQuery } from '@/api/authApi'

/**
 * useAuth — RTK Query getMe 캐시를 단일 출처로 구독
 *
 * - user:          GET /auth/me 응답 객체 (null이면 비로그인)
 * - isInitialized: 최초 /auth/me 요청 완료 여부 (로딩 중 = false)
 * - isLoggedIn:    user !== null
 * - isAdmin:       role === 'ROLE_ADMIN'
 */
export default function useAuth() {
  const { data: user, isLoading } = useGetMeQuery()

  return {
    user:          user ?? null,
    isInitialized: !isLoading,
    isLoggedIn:    !!user,
    isAdmin:       user?.role === 'ADMIN',
  }
}

import { useGetCsrfQuery } from '@/api/authApi'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import Spinner from '@/shared/components/Spinner'
import useAuth from './useAuth'

export default function AuthInitializer({ children }) {
  useGetCsrfQuery()       // 앱 시작 시 XSRF-TOKEN 쿠키 발급
  useGetCategoriesQuery()

  const { isInitialized } = useAuth()  // 내부적으로 useGetMeQuery() 호출

  if (!isInitialized) return <Spinner fullscreen />
  return children
}

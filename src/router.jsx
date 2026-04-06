import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import { useGetMeQuery } from '@/api/authApi'
import useAppSelector from '@/hooks/useAppSelector'
import { selectIsAuthenticated } from '@/features/auth/authSlice'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import OdogPage from './pages/OdogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrderPage from './pages/OrderPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CSPage from './pages/CSPage'

/**
 * 앱 초기화 컴포넌트
 * - 카테고리 목록: 항상 prefetch
 * - 사용자 정보: 인증 상태일 때만 복원 (토큰 있을 때)
 */
function AppInit({ children }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useGetCategoriesQuery()
  useGetMeQuery(undefined, { skip: !isAuthenticated })

  return children
}

export default function Router() {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/list" element={<StorePage />} />
            <Route path="/product/list/odog" element={<OdogPage />} />
            <Route path="/product/detail/:id" element={<ProductDetailPage />} />
            <Route path="/order/list" element={<OrderPage />} />
            <Route path="/cs" element={<CSPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AppInit>
    </BrowserRouter>
  )
}

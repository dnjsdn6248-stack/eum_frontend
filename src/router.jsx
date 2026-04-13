import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import { useGetMeQuery, useGetCsrfQuery } from '@/api/authApi'
import useAppSelector from '@/hooks/useAppSelector'
import { selectIsInitialized } from '@/features/auth/authSlice'
import Layout from './features/components/layout/Layout'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import OdogPage from './pages/OdogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrderPage from './pages/OrderPage'
import OrderDetailPage from './pages/OrderDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CSPage from './pages/CSPage'
import CartPage from './pages/CartPage'
import BrandStoryPage from './pages/BrandStoryPage'
import BestSellerPage from './pages/BestSellerPage'
import CheckoutPage from './pages/CheckoutPage'
import UserProfilePage from './pages/UserProfilePage'
import ProfileModifyPage from './pages/ProfileModifyPage'
import WishListPage from './pages/WishListPage'
import UserCouponPage from "./pages/UserCouponPage";
import UserPointPage from "./pages/UserPointPage"
import UserSubscriptionPage from "./pages/UserSubscriptionPage";
import UserAddressPage from './pages/UserAddressPage ';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';


function AuthInitializer({ children }) {
  useGetCsrfQuery()        // 앱 시작 시 XSRF-TOKEN 쿠키 발급
  useGetCategoriesQuery()
  useGetMeQuery()          // 401 → withReauth → /auth/refresh → 재시도
  const isInitialized = useAppSelector(selectIsInitialized)

  if (!isInitialized) return null
  return children
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route element={<Layout />}>
          <Route path="/terms" element={<TermsPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/product/list" element={<StorePage />} />
            <Route path="/product/list/odog" element={<OdogPage />} />
            <Route path="/product/detail/:id" element={<ProductDetailPage />} />
            <Route path="/subscription/detail/:id" element={<ProductDetailPage />} />
            <Route path="/best" element={<BestSellerPage />} />
            <Route path="/order/list" element={<OrderPage />} />
            <Route path="/order/detail/:id" element={<OrderDetailPage />} />
            <Route path="/cs" element={<CSPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/mypage" element={<UserProfilePage />} />
            <Route path="/profile/modify" element={<ProfileModifyPage />} />
            <Route path="/wishlist" element={<WishListPage />} />
            <Route path="/coupon" element={<UserCouponPage />} />
            <Route path="/point" element={<UserPointPage />} />
            <Route path="/address" element={<UserAddressPage />} /> 
         <Route path="/user-subscription" element={<UserSubscriptionPage />} />
            <Route path="/brand-story" element={<BrandStoryPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  )
}
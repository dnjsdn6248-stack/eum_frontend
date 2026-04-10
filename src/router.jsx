import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import { useGetMeQuery } from '@/api/authApi'
import useAppSelector from '@/hooks/useAppSelector'
import { selectIsAuthenticated } from '@/features/auth/authSlice'
import Layout from './features/components/layout/Layout'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import OdogPage from './pages/OdogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrderPage from './pages/OrderPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CSPage from './pages/CSPage'
import CartPage from './pages/CartPage'
import BrandStoryPage from './pages/BrandStoryPage'
import SubscriptionPage from './pages/SubscriptionPage'
import SubscriptionDetailPage from './pages/SubscriptionDetailPage.jsx'
import BestSellerPage from './pages/BestSellerPage'
import CheckoutPage from './pages/CheckoutPage'
import UserProfilePage from './pages/UserProfilePage'
import ProfileModifyPage from './pages/ProfileModifyPage'
import WishListPage from './pages/WishListPage'
import UserCouponPage from "./pages/UserCouponPage";
import UserPointPage from "./pages/UserPointPage"
import UserSubscriptionPage from "./pages/UserSubscriptionPage";
import UserAddressPage from './pages/UserAddressPage ';


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
            <Route path="/subscription/detail/:id" element={<SubscriptionDetailPage />} />
            <Route path="/best" element={<BestSellerPage />} />
            <Route path="/order/list" element={<OrderPage />} />
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
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AppInit>
    </BrowserRouter>
  )
}
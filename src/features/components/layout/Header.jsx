import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, ShoppingBag, ReceiptText } from 'lucide-react'
import SearchBar from './SearchBar'
import useAuth from '@/features/auth/useAuth'
import { useLogoutMutation } from '@/api/authApi'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import { PROVIDER_LABELS } from '@/shared/utils/oauth2'
import Toast from '../ui/Toast'

export default function Header() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const [logoutMutation] = useLogoutMutation()
  const [oauthToast, setOauthToast] = useState(null)
  const { data: categories = [] } = useGetCategoriesQuery()

  // OAuth 로그인 완료 감지 — sessionStorage에 provider가 남아있으면 Toast 표시
  useEffect(() => {
    if (!isLoggedIn) return
    const provider = sessionStorage.getItem('pendingOAuthProvider')
    if (provider) {
      sessionStorage.removeItem('pendingOAuthProvider')
      setOauthToast(PROVIDER_LABELS[provider] ?? provider)
    }
  }, [isLoggedIn])

  const handleLogout = async () => {
    await logoutMutation()
    navigate('/')
  }

  return (
    <>
    {oauthToast && (
      <Toast
        message={`${oauthToast} 계정으로 로그인됐어요!`}
        onClose={() => setOauthToast(null)}
      />
    )}
    <header className="relative w-full bg-white z-[100] border-b border-gray-100">

      {/* 상단 유틸리티 바 */}
      <div className="bg-[#f8f8f8] border-b border-gray-100 flex items-center h-[36px]">
        <div className="max-w-[1200px] mx-auto w-full flex justify-end px-6 items-center gap-5">
          {isLoggedIn ? (
            <>
              <span className="text-[12px] font-bold text-[#3ea76e]">
                안녕하세요, {user?.name}님
              </span>
              <button
                onClick={handleLogout}
                className="text-[12px] font-medium text-[#777] hover:text-[#3ea76e] transition-all bg-transparent border-none cursor-pointer p-0"
              >
                로그아웃
              </button>
              <Link to="/mypage" className="text-[12px] font-medium text-[#777] hover:text-[#3ea76e] transition-all">
                마이페이지
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[12px] font-medium text-[#777] hover:text-[#3ea76e] transition-all">
                로그인
              </Link>
              <Link to="/signup" className="text-[12px] font-medium text-[#777] hover:text-[#3ea76e] transition-all">
                회원가입
              </Link>
            </>
          )}
          <Link to="/cs" className="text-[12px] font-medium text-[#777] hover:text-[#3ea76e] transition-all">
            고객센터
          </Link>
        </div>
      </div>

      {/* 로고 + 검색 + 아이콘 */}
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-[110px]">
        <div className="flex-shrink-0">
          <Link to="/" className="inline-flex items-center">
            <div className="text-[#3ea76e] text-[42px] font-black tracking-[-0.05em] leading-none">
              SWIFFY<span className="text-[14px] align-top ml-1 opacity-80 italic">®</span>
            </div>
          </Link>
        </div>

        <SearchBar />

        <div className="flex-shrink-0 flex justify-end gap-10 pt-1">
          {/* 마이페이지 / 로그인 아이콘 */}
          <Link to={isLoggedIn ? '/mypage' : '/login'} className="flex flex-col items-center group text-[#222]">
            <div className="group-hover:text-[#3ea76e] transition-colors">
              <User size={26} strokeWidth={1.8} />
            </div>
            <span className="text-[12px] font-semibold mt-1.5 opacity-80 group-hover:opacity-100 group-hover:text-[#3ea76e] transition-all max-w-[56px] truncate text-center">
              {isLoggedIn ? `${user?.name}님` : '로그인'}
            </span>
          </Link>

          {/* 주문조회 */}
          <Link to="/order/list" className="flex flex-col items-center group text-[#222]">
            <div className="group-hover:text-[#3ea76e] transition-colors">
              <ReceiptText size={28} strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-semibold mt-1.5 opacity-80 group-hover:opacity-100 group-hover:text-[#3ea76e] transition-all">
              주문조회
            </span>
          </Link>

          {/* 장바구니 */}
          <Link to="/cart" className="flex flex-col items-center group text-[#222]">
            <div className="relative group-hover:text-[#3ea76e] transition-colors">
              <ShoppingBag size={28} strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-semibold mt-1.5 opacity-80 group-hover:opacity-100 group-hover:text-[#3ea76e] transition-all">
              장바구니
            </span>
          </Link>
        </div>
      </div>

      {/* GNB */}
      <nav className="bg-white border-t border-gray-100 flex items-center h-[60px]">
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-center gap-20">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/product/list?categoryId=${cat.id}`}
              className="group relative py-2"
            >
              <span className="text-[17px] font-bold text-[#111] tracking-tighter transition-colors group-hover:text-[#3ea76e]">
                {cat.name}
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#3ea76e] transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>
      </nav>
    </header>
    </>
  )
}
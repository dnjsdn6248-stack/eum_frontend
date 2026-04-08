import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, ShoppingBag, ReceiptText, Headphones } from 'lucide-react' // Headphones 추가
import SearchBar from './SearchBar'
import { NAV_ITEMS } from '../../../mock'

export default function Header() {
  return (
    <header className="relative w-full bg-white z-[100] border-b border-gray-100">
      {/* 최상단 유틸리티 메뉴: 폰트 가독성 및 간격 조정 */}
      <div className="bg-[#f8f8f8] border-b border-gray-100 flex items-center h-[36px]"> {/* 배경색을 살짝 깔아 본문과 분리 */}
        <div className="max-w-[1200px] mx-auto w-full flex justify-end px-6 items-center gap-5">
          {[
            { text: '로그인', to: '/login' },
            { text: '회원가입', to: '/signup' },
            { text: '고객센터', to: '/cs' },
          ].map((item) => (
            <Link key={item.text} to={item.to} className="text-[12px] font-medium text-[#777] hover:text-[#3ea76e] transition-all">
              {item.text}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-[110px]"> {/* 높이 소폭 확장으로 여유 부여 */}
        <div className="flex-shrink-0">
          <Link to="/" className="inline-flex items-center">
            <div className="text-[#3ea76e] text-[42px] font-black tracking-[-0.05em] leading-none">
              SWIFFY<span className="text-[14px] align-top ml-1 opacity-80 italic">®</span>
            </div>
          </Link>
        </div>

        <SearchBar />

        <div className="flex-shrink-0 flex justify-end gap-10 pt-1">
          {[
            { label: 'MY', icon: <User size={28} strokeWidth={1.5} />, to: '/login' }, // strokeWidth 조절로 세련미 추가
            { label: '주문조회', icon: <ReceiptText size={28} strokeWidth={1.5} />, to: '/order/list' },
            { label: '장바구니', icon: <ShoppingBag size={28} strokeWidth={1.5} />, to: '/cart', badge: '2' },
          ].map((item, idx) => (
            <Link key={idx} to={item.to} className="flex flex-col items-center group text-[#222]">
              <div className="relative group-hover:text-[#3ea76e] transition-colors">
                {item.icon}
                {item.badge && (
                  // 뱃지 디자인: 브랜드 컬러인 초록색 계열 혹은 명확한 대비색으로 변경 권장
                  <span className="absolute -top-1 -right-2 bg-[#ff4b4b] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[12px] font-semibold mt-1.5 opacity-80 group-hover:opacity-100 group-hover:text-[#3ea76e] transition-all">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* GNB: 이모지를 걷어내고 텍스트 본연의 미학을 강조 */}
      <nav className="bg-white border-t border-gray-100 flex items-center h-[60px]">
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-center gap-20">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.to} className="group relative py-2">
              <span className="text-[17px] font-bold text-[#111] tracking-tight transition-colors group-hover:text-[#3ea76e]">
                {/* 만약 mock 데이터에 이모지가 있다면 replace()로 제거하거나, 데이터 자체를 수정하는 걸 추천해 */}
                {item.label.replace(/[\u{1F300}-\u{1F6FF}]/gu, '')} 
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#3ea76e] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { MOCK_USER, MOCK_DELIVERY_STATUS } from '../mock'

export default function UserProfilePage() {
  const user = MOCK_USER
  const menuItems = [
    { title: '주문조회', to: '/order/list' },
    { title: '회원정보', to: '/profile/modify' },
    { title: '관심상품', count: user.wishlistCount, to: '/wishlist' },
    { title: '적립금', to: '/point' },
    { title: '쿠폰', count: user.coupons, to: '/coupon' },
    { title: '게시물관리', to: '/profile/posts' },
    { title: '배송 주소록 관리', to: '/address' },
    { title: '정기배송 관리', to: '/user-subscription' },
  ]

  return (
    <div className="bg-[#FCFBF9] min-h-screen text-[#111]">
      <main className="max-w-[1000px] mx-auto px-6 pb-28">

        <div className="max-w-[1200px] mx-auto text-center py-24">
          <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">마이페이지</h1>
        </div>

        <section className="bg-white rounded-[40px] border border-[#eee] p-10 mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-[#f0faf4] text-[#3ea76e] mb-4 tracking-widest">
            {user.rank} 
          </span>
          <h2 className="text-[26px] font-black tracking-tight text-[#111] mb-10">
            {user.name}님, 안녕하세요!
          </h2>

          <div className="flex justify-between items-center px-4">
            {[
              { label: '적립금', value: `${user.points}원` },
              { label: '쿠폰', value: `${user.coupons}개` },
              { label: '주문내역', value: `${user.orderCount}건` },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center flex-1">
                <div className="text-center flex-1">
                  <p className="text-[12px] font-bold text-[#bbb] mb-2">{item.label}</p>
                  <p className="text-[20px] font-black text-[#111]">{item.value}</p>
                </div>
                {i < 2 && <div className="w-[1px] h-8 bg-[#eee]" />}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[40px] border border-[#eee] p-10 mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[18px] font-black text-[#111] tracking-tight">
              최근 주문 내역
              <span className="text-[13px] font-bold text-[#bbb] ml-2">최근 3개월</span>
            </h3>
            <Link to="/order/list" className="text-[13px] font-bold text-[#aaa] hover:text-[#3ea76e] flex items-center gap-1 transition-colors">
              전체보기 <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-4 relative mb-10">
            {MOCK_DELIVERY_STATUS.map((status, idx) => (
              <div key={idx} className="text-center relative">
                <p className="text-[13px] font-bold text-[#bbb] mb-4">{status.label}</p>
                <p className={`text-[28px] font-black ${status.count > 0 ? 'text-[#3ea76e]' : 'text-[#eee]'}`}>
                  {status.count}
                </p>
                {idx < 3 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-[#f0f0f0]" />}
              </div>
            ))}
          </div>

          <div className="flex justify-around py-5 bg-[#f9f9f9] rounded-2xl border border-[#eee] mb-8">
            {[
              { label: '취소', count: 2 },
              { label: '교환', count: 0 },
              { label: '반품', count: 0 },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3 text-[13px] font-bold">
                <span className="text-[#aaa]">{item.label}</span>
                <span className="text-[#111]">{item.count}</span>
                {i < 2 && <div className="w-[1px] h-4 bg-[#eee] ml-3" />}
              </div>
            ))}
          </div>

        </section>

        <section className="bg-white rounded-[40px] border border-[#eee] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <div className="px-10 py-7 border-b border-[#f5f5f5]">
            <h3 className="text-[15px] font-bold text-[#bbb]">계정 및 서비스 관리</h3>
          </div>
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="flex justify-between items-center py-6 px-10 border-b border-[#f9f9f9] last:border-none hover:bg-[#fafafa] transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-black text-[#111] group-hover:text-[#3ea76e] transition-colors">
                  {item.title}
                </span>
                {item.count !== undefined && (
                  <span className="text-[12px] font-black text-[#3ea76e] bg-[#f0faf4] px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
              <ChevronRight size={15} className="text-[#ddd] group-hover:text-[#3ea76e] transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </section>

        <div className="mt-8 text-center">
          <button className="text-[13px] font-bold text-[#bbb] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer">
            로그아웃
          </button>
        </div>

      </main>
    </div>
  )
}

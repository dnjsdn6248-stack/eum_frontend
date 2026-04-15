import { useState, useEffect } from 'react'
import StoreProductGrid from '../features/product/StoreProductGrid'
import { STORE_PRODUCTS } from '../mock'
import Pagination from '../shared/components/Pagination'

const ITEMS_PER_PAGE = 12

export default function SubscriptionPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품순')

  useEffect(() => { window.scrollTo(0, 0) }, [currentPage])

  const totalPages = Math.ceil(STORE_PRODUCTS.length / ITEMS_PER_PAGE)
  const paginated = STORE_PRODUCTS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(Math.max(totalPages, 1))
    }
  }, [currentPage, totalPages])

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
      <div className="py-16 text-center border-b border-gray-100 mb-10">
        <h1 className="text-[32px] font-black tracking-tight text-[#111]">정기배송 할인</h1>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-12 px-2">
        <span className="text-[14px] font-medium text-[#bbb]">{STORE_PRODUCTS.length}개의 제품</span>
        <div className="relative">
        <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
            className="appearance-none border border-[#eee] rounded-full px-6 py-2 pr-10 text-[14px] font-bold text-[#888] bg-white outline-none cursor-pointer focus:border-[#3ea76e] transition-all tracking-tighter"
          >
            <option value="인기상품순">인기상품순</option>
            <option value="신상품순">신상품순</option>
            <option value="낮은가격순">낮은가격순</option>
            <option value="높은가격순">높은가격순</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      <StoreProductGrid products={paginated} basePath="/subscription/detail" />

   {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      )}
    </main>
  )
}

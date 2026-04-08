import { useState, useEffect } from 'react'
import StoreProductGrid from '../features/product/StoreProductGrid'
import { STORE_PRODUCTS } from '../mock'

const ITEMS_PER_PAGE = 12

export default function BestSellerPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품순')

  useEffect(() => { window.scrollTo(0, 0) }, [currentPage])

  const sorted = [...STORE_PRODUCTS].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''))
    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''))
    if (sortBy === '낮은가격순') return priceA - priceB
    if (sortBy === '높은가격순') return priceB - priceA
    return 0
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
      <div className="py-16 text-center border-b border-gray-100 mb-10">
        <h1 className="text-[32px] font-black tracking-tight text-[#111]"> 베스트셀러</h1>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-12 px-2">
        <span className="text-[14px] font-medium text-[#bbb] tracking-tighter">
          총 <span className="text-[#3ea76e] font-bold">{sorted.length}</span>개의 제품
        </span>
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
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="3">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      <StoreProductGrid products={paginated} />

      {totalPages > 1 && (
        <div className="py-20 flex items-center justify-center gap-6 mt-10">
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="text-[#ccc] hover:text-[#3ea76e] transition-colors text-xl font-light disabled:opacity-30 cursor-pointer bg-transparent border-none"
            >«</button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-[#ccc] hover:text-[#3ea76e] transition-colors text-xl font-light disabled:opacity-30 cursor-pointer bg-transparent border-none"
            >‹</button>
          </div>

          <div className="flex gap-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-bold transition-all cursor-pointer border-2 ${
                  currentPage === page
                    ? 'bg-[#3ea76e] text-white border-[#3ea76e] shadow-sm'
                    : 'bg-white text-[#ccc] border-[#eee] hover:border-[#3ea76e] hover:text-[#3ea76e]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-[#ccc] hover:text-[#3ea76e] transition-colors text-xl font-light disabled:opacity-30 cursor-pointer bg-transparent border-none"
            >›</button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="text-[#ccc] hover:text-[#3ea76e] transition-colors text-xl font-light disabled:opacity-30 cursor-pointer bg-transparent border-none"
            >»</button>
          </div>
        </div>
      )}
    </main>
  )
}
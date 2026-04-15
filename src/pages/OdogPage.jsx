import { useState, useEffect } from 'react'
import Footer from '../features/components/layout/Footer'
import { ODOG_PRODUCTS } from '../mock'
import Pagination from '../shared/components/Pagination'


const ITEMS_PER_PAGE = 8
const SORT_OPTIONS = ['인기상품', '신상품', '낮은가격', '높은가격']

export default function OdogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품')

  const totalPages = Math.ceil(ODOG_PRODUCTS.length / ITEMS_PER_PAGE)
  const paginated = ODOG_PRODUCTS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(Math.max(totalPages, 1))
    }
  }, [currentPage, totalPages])

  return (
    <main className="max-w-[1200px] mx-auto w-full">
      <div className="bg-white border-b border-[#f0f0f0]">
        <div className="px-4 py-5 flex items-center gap-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#222] leading-tight">오독오독</h1>
            <p className="text-[12px] text-[#888] mt-0.5">바삭하게 씹히는 자연산 간식</p>
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {['전체', '바삭', '세트', '대용량', '미니'].map((tag, i) => (
            <button
              key={tag}
              className={`flex-none px-4 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all ${
                i === 0 ? 'border-[#3ea76e] bg-[#3ea76e] text-white' : 'border-[#ddd] bg-white text-[#555] hover:border-[#3ea76e] hover:text-[#3ea76e]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
        <span className="text-[13px] text-[#888]">
          <strong className="text-[#222]">{ODOG_PRODUCTS.length}</strong>개의 제품
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
            className="appearance-none text-[13px] text-[#444] font-medium bg-transparent border-none outline-none cursor-pointer pr-5"
          >
            {SORT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#888] text-xs">∨</span>
        </div>
      </div>

      <div className="bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#f0f0f0]">
          {paginated.map(product => <OdogProductCard key={product.id} product={product} />)}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      )}

      <Footer />
    </main>
  )
}

function OdogProductCard({ product }) {
  return (
    <a href={product.href} className="group block bg-white p-3 hover:bg-[#fafafa] transition-colors">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f8f8f8] mb-2.5">
        <img src={product.img} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.04]" />
        {product.set && (
          <span className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 border border-[#ccc] flex items-center justify-center text-[10px] font-bold text-[#444] shadow-sm">SET</span>
        )}
        {product.discountPrice && (
          <span className="absolute top-2 left-2 bg-[#3ea76e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px]">최적할인</span>
        )}
      </div>
      <p className="text-[13px] text-[#222] leading-snug line-clamp-2 mb-1.5 min-h-[38px]">{product.name}</p>
      {product.discountPrice ? (
        <div>
          <p className="text-[11px] text-[#bbb] line-through leading-none mb-0.5">{product.originalPrice}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-[#3ea76e]">최적할인가</span>
            <span className="text-[14px] font-bold text-[#222]">{product.discountPrice}</span>
          </div>
        </div>
      ) : (
        <p className="text-[14px] font-bold text-[#222]">{product.originalPrice}</p>
      )}
    </a>
  )
}

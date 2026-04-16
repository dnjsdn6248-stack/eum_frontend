import { useState, useEffect } from 'react'
import Footer from '../features/components/layout/Footer'
import Pagination from '../shared/components/Pagination'
import Spinner from '../shared/components/Spinner'
import { useGetProductsQuery } from '../api/productApi'

const ITEMS_PER_PAGE = 8
const SORT_OPTIONS = ['인기상품', '신상품', '낮은가격', '높은가격']

const SORT_MAP = {
  '인기상품': { sortBy: 'sales',     sortDir: 'desc' },
  '신상품':   { sortBy: 'createdAt', sortDir: 'desc' },
  '낮은가격': { sortBy: 'price',     sortDir: 'asc'  },
  '높은가격': { sortBy: 'price',     sortDir: 'desc' },
}

export default function OdogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품')

  const { sortBy: apiSortBy, sortDir } = SORT_MAP[sortBy] ?? SORT_MAP['인기상품']

  const { data, isLoading } = useGetProductsQuery({
    brand: '오독오독',
    page: currentPage,
    size: ITEMS_PER_PAGE,
    sortBy: apiSortBy,
    sortDir,
  })

  const products = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const totalCount = data?.totalElements ?? 0

  useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(Math.max(totalPages, 1))
    }
  }, [currentPage, totalPages])

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  return (
    <main className="max-w-[1200px] mx-auto w-full">
      <div className="bg-white border-b border-[#f0f0f0]">
        <div className="px-4 py-5 flex items-center gap-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#222] leading-tight">오독오독</h1>
            <p className="text-[12px] text-[#888] mt-0.5">바삭하게 씹히는 자연산 간식</p>
          </div>
        </div>
      </div>

      <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
        <span className="text-[13px] text-[#888]">
          <strong className="text-[#222]">{totalCount}</strong>개의 제품
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => handleSortChange(e.target.value)}
            className="appearance-none text-[13px] text-[#444] font-medium bg-transparent border-none outline-none cursor-pointer pr-5"
          >
            {SORT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#888] text-xs">∨</span>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#f0f0f0]">
            {products.map(product => <OdogProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      )}

      <Footer />
    </main>
  )
}

function OdogProductCard({ product }) {
  return (
    <a href={`/product/detail/${product.id}`} className="group block bg-white p-3 hover:bg-[#fafafa] transition-colors">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f8f8f8] mb-2.5">
        <img src={product.img} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.04]" />
        {product.discountPrice && (
          <span className="absolute top-2 left-2 bg-[#3ea76e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px]">최적할인</span>
        )}
      </div>
      <p className="text-[13px] text-[#222] leading-snug line-clamp-2 mb-1.5 min-h-[38px]">{product.name}</p>
      {product.discountPrice ? (
        <div>
          <p className="text-[11px] text-[#bbb] line-through leading-none mb-0.5">
            {typeof product.price === 'number' ? `${product.price.toLocaleString()}원` : product.price}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-[#3ea76e]">최적할인가</span>
            <span className="text-[14px] font-bold text-[#222]">
              {typeof product.discountPrice === 'number' ? `${product.discountPrice.toLocaleString()}원` : product.discountPrice}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-[14px] font-bold text-[#222]">
          {typeof product.price === 'number' ? `${product.price.toLocaleString()}원` : product.price}
        </p>
      )}
    </a>
  )
}

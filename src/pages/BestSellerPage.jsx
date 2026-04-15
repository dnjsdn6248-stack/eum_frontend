import { useState, useEffect } from 'react'
import StoreProductGrid from '../features/product/StoreProductGrid'
import Pagination from '../shared/components/Pagination'
import Spinner from '../shared/components/Spinner'
import { useGetProductsQuery } from '../api/productApi'

const ITEMS_PER_PAGE = 12

const SORT_MAP = {
  '최신순':   { sortBy: 'createdAt', sortDir: 'desc' },
  '판매량순': { sortBy: 'sales',     sortDir: 'desc' },
  '낮은가격순': { sortBy: 'price',  sortDir: 'asc'  },
  '높은가격순': { sortBy: 'price',  sortDir: 'desc' },
}

export default function BestSellerPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('판매량순')

  useEffect(() => { window.scrollTo(0, 0) }, [currentPage])

  const { sortBy: apiSortBy, sortDir } = SORT_MAP[sortBy] ?? SORT_MAP['판매량순']

  const { data, isLoading } = useGetProductsQuery({
    page: currentPage,
    size: ITEMS_PER_PAGE,
    sortBy: apiSortBy,
    sortDir,
  })

  const products = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const totalCount = data?.totalElements ?? 0

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
      <div className="py-16 text-center border-b border-gray-100 mb-10">
        <h1 className="text-[32px] font-black tracking-tight text-[#111]"> 베스트셀러</h1>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-12 px-2">
        <span className="text-[14px] font-medium text-[#bbb] tracking-tighter">
          총 <span className="text-[#3ea76e] font-bold">{totalCount}</span>개의 제품
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => handleSortChange(e.target.value)}
            className="appearance-none border border-[#eee] rounded-full px-6 py-2 pr-10 text-[14px] font-bold text-[#888] bg-white outline-none cursor-pointer focus:border-[#3ea76e] transition-all tracking-tighter"
          >
            <option value="최신순">최신순</option>
            <option value="판매량순">판매량순</option>
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

      {isLoading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-[#bbb] font-bold text-[16px]">상품이 없습니다.</div>
      ) : (
        <StoreProductGrid products={products} />
      )}

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      )}
    </main>
  )
}

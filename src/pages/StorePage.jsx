import { useState, useEffect } from 'react'
import StoreProductGrid from '../features/product/StoreProductGrid'
import { STORE_PRODUCTS } from '../mock'

const TABS = ['ALL', 'Snack & Jerky', 'Meal', 'Bakery']

const ITEMS_PER_PAGE = 12

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품순')

  useEffect(() => { window.scrollTo(0, 0) }, [currentPage, activeTab])

  const filtered = activeTab === 'ALL' ? STORE_PRODUCTS : STORE_PRODUCTS.filter(p => p.category === activeTab)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleTabChange = (tab) => { setActiveTab(tab); setCurrentPage(1) }

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
      <div className="flex justify-center gap-3 py-10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`hover-primary px-7 py-2.5 text-[14px] !font-medium tracking-tighter transition-all cursor-pointer ${activeTab === tab ? 'active shadow-sm' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-10">
        <span className="text-[14px] !font-normal text-[#111111] tracking-tighter">
          총 <span className="text-[#3ea76e] font-bold">{filtered.length}</span>개의 제품
        </span>
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
      </div>

      <StoreProductGrid products={paginated} />

      {totalPages > 1 && (
        <div className="py-16 flex items-center justify-center gap-2 border-t border-gray-50 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] !font-medium transition-all cursor-pointer ${
                currentPage === page ? 'bg-[#3ea76e] !text-white shadow-md' : 'bg-transparent text-[#999999] hover:bg-[#3ea76e] hover:!text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
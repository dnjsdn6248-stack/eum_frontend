import StoreProductGrid from '../features/product/StoreProductGrid'
import Pagination from '../shared/components/Pagination'
import useStorePageController from '@/features/product/useStorePageController'

export default function StorePage() {
  const {
    tabs,
    sortOptions,
    activeTabId,
    activeSubCategory,
    sortLabel,
    currentPage,
    totalPages,
    totalCount,
    products,
    subCategories,
    showSubTabs,
    searchTitle,
    setCurrentPage,
    handleTabChange,
    handleSubCategoryToggle,
    handleSortChange,
  } = useStorePageController()

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">

      {searchTitle && (
        <div className="pt-10 pb-2 text-center">
          <p className="text-[22px] font-black text-[#111] tracking-tight">
            <span className="text-[#3ea76e]">"{searchTitle}"</span> 검색 결과
          </p>
        </div>
      )}

      {/* 대카테고리 탭 — API 데이터 기준, 개수·이름 자동 반영 */}
      <div className="flex justify-center gap-3 py-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`hover-primary px-7 py-2.5 text-[14px] !font-medium tracking-tighter transition-all cursor-pointer ${activeTabId === tab.id ? 'active shadow-sm' : ''}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 소카테고리 탭 — 대카테고리 선택 시 */}
      {showSubTabs && (
        <div className="mb-8">
          <div className="flex justify-center flex-wrap gap-2">
            {subCategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleSubCategoryToggle(sub.id)}
                className={`hover-primary px-5 py-2 text-[13px] !font-medium tracking-tighter transition-all cursor-pointer ${activeSubCategory === sub.id ? 'active shadow-sm' : ''}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-10">
        <span className="text-[14px] font-normal text-[#111] tracking-tighter">
          총 <span className="text-[#3ea76e] font-bold">{totalCount}</span>개의 제품
        </span>
        <select
          value={sortLabel}
          onChange={e => handleSortChange(e.target.value)}
          className="appearance-none border border-[#eee] rounded-full px-6 py-2 pr-10 text-[14px] font-bold text-[#888] bg-white outline-none cursor-pointer focus:border-[#3ea76e] transition-all tracking-tighter"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <StoreProductGrid products={products} />

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      )}

    </main>
  )
}

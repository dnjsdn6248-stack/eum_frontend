import StoreProductGrid from '../features/product/StoreProductGrid'
import Pagination from '../shared/components/Pagination'
import useStorePageController from '@/features/product/useStorePageController'

export default function StorePage() {
  const {
    tabs,
    sortOptions,
    activeTab,
    activeSubCategory,
    sortLabel,
    currentPage,
    totalPages,
    totalCount,
    products,
    subCategories,
    showSubTabs,
    setCurrentPage,
    handleTabChange,
    handleSubCategoryToggle,
    handleSortChange,
  } = useStorePageController()

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">

      {activeTab === 'ALL' && (
        <div className="flex justify-center gap-3 py-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`hover-primary px-7 py-2.5 text-[14px] !font-medium tracking-tighter transition-all cursor-pointer ${activeTab === tab ? 'active shadow-sm' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {showSubTabs && (
        <div className={`${activeSubCategory ? 'pt-10' : ''} mb-8`}>
          <p className="text-center text-[18px] font-black text-[#111] tracking-tight mb-5">{activeTab}</p>
          <div className="flex justify-center flex-wrap gap-2">
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => handleSubCategoryToggle(sub)}
                className={`hover-primary px-5 py-2 text-[13px] !font-medium tracking-tighter transition-all cursor-pointer ${activeSubCategory === sub ? 'active shadow-sm' : ''}`}
              >
                {sub}
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

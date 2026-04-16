import { useEffect } from 'react'
import { useSearchProductsQuery } from '@/api/searchApi'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import useAppDispatch from '@/hooks/useAppDispatch'
import useAppSelector from '@/hooks/useAppSelector'
import {
  selectProductPagination,
  selectStoreView,
  setPage,
  setStoreActiveTab,
  setStoreSortLabel,
  toggleStoreSubCategory,
} from './productSlice'

const TABS = ['ALL', 'Snack & Jerky', 'Meal', 'Bakery']

const SUB_CATEGORIES = {
  'Snack & Jerky': ['오독오독', '청정 육포', '어글어글 육포', '어글어글 우유껌', '기타'],
  'Meal': ['스위피 테린', '어글어글 스팀', '샐러드', '두유'],
  'Bakery': [],
}

const SORT_OPTIONS = ['최신순', '판매량순', '낮은가격순', '높은가격순']

// productSlice sortLabel → Search Server sortType
const SORT_TYPE_MAP = {
  '최신순':    '최신순',
  '판매량순':  '판매량순',
  '낮은가격순': '가격 낮은순',
  '높은가격순': '가격 높은순',
}

export default function useStorePageController() {
  const dispatch = useAppDispatch()
  const { page: currentPage } = useAppSelector(selectProductPagination)
  const { activeTab, activeSubCategory, sortLabel } = useAppSelector(selectStoreView)

  // 카테고리 목록 (탭 렌더링용)
  useGetCategoriesQuery()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, activeTab])

  const { data, isFetching } = useSearchProductsQuery({
    category:    activeTab === 'ALL' ? undefined : activeTab,
    subCategory: activeSubCategory ?? undefined,
    sortType:    SORT_TYPE_MAP[sortLabel],
    page:        currentPage - 1,   // Search Server: 0-based
  })

  const products    = data?.content       ?? []
  const totalPages  = data?.totalPages    ?? 1
  const totalCount  = data?.totalElements ?? 0

  const subCategories = SUB_CATEGORIES[activeTab] || []
  const showSubTabs   = activeTab !== 'ALL' && subCategories.length > 0

  return {
    tabs: TABS,
    sortOptions: SORT_OPTIONS,
    activeTab,
    activeSubCategory,
    sortLabel,
    currentPage,
    totalPages,
    totalCount,
    products,
    subCategories,
    showSubTabs,
    isFetching,
    setCurrentPage:          (page) => dispatch(setPage(page)),
    handleTabChange:         (tab)  => dispatch(setStoreActiveTab(tab)),
    handleSubCategoryToggle: (sub)  => dispatch(toggleStoreSubCategory(sub)),
    handleSortChange:        (lbl)  => dispatch(setStoreSortLabel(lbl)),
  }
}

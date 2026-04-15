import { useEffect } from 'react'
import { useGetProductsQuery } from '@/api/productApi'
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

const SORT_MAP = {
  '최신순':   { sortBy: 'createdAt', sortDir: 'desc' },
  '판매량순': { sortBy: 'sales',     sortDir: 'desc' },
  '낮은가격순': { sortBy: 'price',  sortDir: 'asc'  },
  '높은가격순': { sortBy: 'price',  sortDir: 'desc' },
}

export default function useStorePageController() {
  const dispatch = useAppDispatch()
  const { page: currentPage, size } = useAppSelector(selectProductPagination)
  const { activeTab, activeSubCategory, sortLabel } = useAppSelector(selectStoreView)

  const { data: categories = [] } = useGetCategoriesQuery()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, activeTab])

  const categoryId = activeTab === 'ALL'
    ? undefined
    : (categories.find((c) => c.name === activeTab)?.id ?? undefined)

  const { sortBy, sortDir } = SORT_MAP[sortLabel] ?? SORT_MAP['최신순']

  const { data, isFetching } = useGetProductsQuery({
    categoryId,
    page: currentPage,
    size,
    sortBy,
    sortDir,
  })

  const products = data?.content ?? []
  const totalPages = data?.totalPages ?? 1
  const totalCount = data?.totalElements ?? 0

  const subCategories = SUB_CATEGORIES[activeTab] || []
  const showSubTabs = activeTab !== 'ALL' && subCategories.length > 0

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
    setCurrentPage: (page) => dispatch(setPage(page)),
    handleTabChange: (tab) => dispatch(setStoreActiveTab(tab)),
    handleSubCategoryToggle: (subCategory) => dispatch(toggleStoreSubCategory(subCategory)),
    handleSortChange: (nextSortLabel) => dispatch(setStoreSortLabel(nextSortLabel)),
  }
}

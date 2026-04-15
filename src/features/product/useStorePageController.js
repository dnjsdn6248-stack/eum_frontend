import { useEffect } from 'react'
import { STORE_PRODUCTS } from '@/mock'
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

const parsePrice = (price) => Number(String(price).replace(/[^0-9]/g, '')) || 0

export default function useStorePageController() {
  const dispatch = useAppDispatch()
  const { page: currentPage, size } = useAppSelector(selectProductPagination)
  const { activeTab, activeSubCategory, sortLabel } = useAppSelector(selectStoreView)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, activeTab])

  const tabFilteredProducts = activeTab === 'ALL'
    ? STORE_PRODUCTS
    : STORE_PRODUCTS.filter((product) => product.category === activeTab)

  const sortedProducts = [...tabFilteredProducts].sort((a, b) => {
    if (sortLabel === '낮은가격순') return parsePrice(a.price) - parsePrice(b.price)
    if (sortLabel === '높은가격순') return parsePrice(b.price) - parsePrice(a.price)
    return 0
  })

  const totalPages = Math.ceil(sortedProducts.length / size)
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * size, currentPage * size)
  const subCategories = SUB_CATEGORIES[activeTab] || []
  const showSubTabs = activeTab !== 'ALL' && subCategories.length > 0

  useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      dispatch(setPage(Math.max(totalPages, 1)))
    }
  }, [currentPage, dispatch, totalPages])

  return {
    tabs: TABS,
    sortOptions: SORT_OPTIONS,
    activeTab,
    activeSubCategory,
    sortLabel,
    currentPage,
    totalPages,
    totalCount: sortedProducts.length,
    products: paginatedProducts,
    subCategories,
    showSubTabs,
    setCurrentPage: (page) => dispatch(setPage(page)),
    handleTabChange: (tab) => dispatch(setStoreActiveTab(tab)),
    handleSubCategoryToggle: (subCategory) => dispatch(toggleStoreSubCategory(subCategory)),
    handleSortChange: (nextSortLabel) => dispatch(setStoreSortLabel(nextSortLabel)),
  }
}

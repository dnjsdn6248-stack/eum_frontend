import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSearchProductsQuery } from '@/api/searchApi'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import useAppDispatch from '@/hooks/useAppDispatch'
import useAppSelector from '@/hooks/useAppSelector'
import {
  selectProductPagination,
  selectStoreView,
  setPage,
  toggleStoreSubCategory,
  resetSubCategory,
  setStoreSortLabel,
} from './productSlice'

const SORT_OPTIONS = ['최신순', '판매량순', '낮은가격순', '높은가격순']

const SORT_TYPE_MAP = {
  '최신순':    '최신순',
  '판매량순':  '판매량순',
  '낮은가격순': '가격 낮은순',
  '높은가격순': '가격 높은순',
}

export default function useStorePageController() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const searchTitle  = searchParams.get('title')    ?? undefined
  const categoryCode = searchParams.get('category') ?? undefined  // "SNACK_JERKY"

  const { data: categories = [] } = useGetCategoriesQuery()

  // activeTabId: URL 파라미터 코드값 기준 — 없으면 'ALL'
  const activeTabId = categoryCode ?? 'ALL'

  const { page: currentPage } = useAppSelector(selectProductPagination)
  const { activeSubCategory, sortLabel } = useAppSelector(selectStoreView)

  // 카테고리 or 검색어 변경 시 첫 페이지로 리셋
  useEffect(() => {
    dispatch(setPage(1))
  }, [categoryCode, searchTitle, dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, categoryCode])

  const { data, isFetching } = useSearchProductsQuery({
    title:       searchTitle,
    category:    categoryCode,
    subCategory: activeSubCategory ?? undefined,
    sortType:    SORT_TYPE_MAP[sortLabel],
    page:        currentPage - 1,
  })

  const products   = data?.content       ?? []
  const totalPages = data?.totalPages    ?? 1
  const totalCount = data?.totalElements ?? 0

  // 탭 목록: API 전체 — 추가·삭제·이름 변경 모두 자동 반영
  const tabs = categories   // [{ id, name, subCategories }]

  // 소카테고리: 현재 탭 id로 조회
  const activeCat     = categories.find(c => c.id === activeTabId)
  const subCategories = activeCat?.subCategories ?? []   // [{ id, code, name }]
  const showSubTabs   = activeTabId !== 'ALL' && subCategories.length > 0

  const handleTabChange = (catId) => {
    dispatch(resetSubCategory())
    if (catId === 'ALL') {
      navigate('/product/list')
    } else {
      navigate(`/product/list?category=${catId}`)
    }
  }

  return {
    tabs,
    sortOptions: SORT_OPTIONS,
    activeTabId,
    activeSubCategory,
    sortLabel,
    currentPage,
    totalPages,
    totalCount,
    products,
    subCategories,
    showSubTabs,
    isFetching,
    searchTitle,
    setCurrentPage:          (page) => dispatch(setPage(page)),
    handleTabChange,
    handleSubCategoryToggle: (subId) => dispatch(toggleStoreSubCategory(subId)),
    handleSortChange:        (lbl)   => dispatch(setStoreSortLabel(lbl)),
  }
}

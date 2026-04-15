import { apiSlice } from './apiSlice'

const normalizeProduct = (p) => ({
  id: p.productId ?? p.id,
  name: p.title ?? p.name,
  img: p.imageUrl ?? p.thumbnailUrl ?? p.img,
  price: p.price,
  category: p.categoryName ?? p.category,
  description: p.description ?? p.desc,
})

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 상품 목록 (필터·페이지네이션 포함) */
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      transformResponse: (res) => {
        const raw = res.content ?? res.data?.content ?? []
        return {
          content: raw.map(normalizeProduct),
          totalPages: res.totalPages ?? res.data?.totalPages ?? 1,
          totalElements: res.totalElements ?? res.data?.totalElements ?? raw.length,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    /** 상품 상세 */
    getProductById: builder.query({
      query: (id) => ({ url: `/products/${id}` }),
      transformResponse: (res) => {
        const p = res.data ?? res
        return {
          id: p.productId ?? p.id,
          name: p.title ?? p.name,
          brand: p.brand,
          desc: p.description ?? p.desc,
          price: p.price,
          img: p.imageUrl ?? p.thumbnailUrl ?? p.img,
          images: p.images ?? (p.imageUrl ? [p.imageUrl] : []),
          options: (p.options ?? []).map((opt) => ({
            label: opt.optionName ?? opt.label,
            extra: opt.additionalPrice ?? opt.extra ?? 0,
          })),
          detailImgs: p.detailImages ?? p.detailImgs ?? [],
          isSubscribable: p.isSubscribable ?? false,
          subscriptionDiscount: p.subscriptionDiscount ?? 0,
          bundleOptions: p.bundleOptions ?? [],
          relatedProducts: (p.relatedProducts ?? []).map((rp) => ({
            id: rp.productId ?? rp.id,
            name: rp.title ?? rp.name,
            originalPrice: rp.originalPrice ?? rp.price,
            discountPrice: rp.discountPrice ?? null,
            img: rp.imageUrl ?? rp.img,
            options: rp.options ?? [],
          })),
        }
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    /** 베스트 상품 */
    getBestProducts: builder.query({
      query: (params = {}) => ({ url: '/products/best', params }),
      transformResponse: (res) => {
        const raw = res.data ?? res.content ?? res ?? []
        const items = Array.isArray(raw) ? raw : []
        return {
          content: items.map(normalizeProduct),
          totalPages: res.totalPages ?? 1,
          totalElements: res.totalElements ?? items.length,
        }
      },
      providesTags: [{ type: 'Product', id: 'BEST' }],
    }),

    /** 신상품 */
    getNewProducts: builder.query({
      query: (limit = 8) => ({ url: '/products/new', params: { limit } }),
      transformResponse: (res) => {
        const raw = res.data ?? res.content ?? res ?? []
        return Array.isArray(raw) ? raw.map(normalizeProduct) : []
      },
      providesTags: [{ type: 'Product', id: 'NEW' }],
    }),

    /** 상품 검색 */
    searchProducts: builder.query({
      query: (params) => ({ url: '/products/search', params }),
      transformResponse: (res) => {
        const raw = res.content ?? res.data?.content ?? []
        return {
          content: raw.map(normalizeProduct),
          totalPages: res.totalPages ?? 1,
          totalElements: res.totalElements ?? raw.length,
        }
      },
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),

    /** 홈 베스트셀러 섹션 (메인페이지 전용) */
    getMainBestSellers: builder.query({
      query: () => ({ url: '/main/best-sellers' }),
      transformResponse: (res) => {
        const items = res.data ?? res ?? []
        return items.map((item) => ({
          id: item.id,
          name: item.title ?? item.name,
          img: item.imageUrl ?? item.img,
          price: item.price,
          productUrl: item.productUrl,
        }))
      },
      providesTags: [{ type: 'Product', id: 'MAIN_BEST' }],
    }),

    /** 홈 배너 슬라이드 목록 (메인페이지 전용) */
    getBannerSlides: builder.query({
      query: () => ({ url: '/main/banners' }),
      transformResponse: (res) => {
        const items = res.data ?? res ?? []
        return items.map((item) => ({
          id: item.id ?? item.bannerId,
          img: item.imageUrl ?? item.img,
          alt: item.altText ?? item.alt ?? '',
          href: item.productUrl ?? item.href ?? '#',
        }))
      },
      providesTags: [{ type: 'Product', id: 'BANNERS' }],
    }),

    /** 홈 해시태그 상품 탭 (메인페이지 전용) */
    getTagProducts: builder.query({
      query: () => ({ url: '/main/tag-products' }),
      transformResponse: (res) => {
        const groups = res.data ?? res ?? []
        return groups.map((group) => ({
          tagName: group.hashtagName ?? `#${group.tagName}`,
          products: (group.products ?? []).map((p) => ({
            id: p.productId ?? p.id,
            name: p.title ?? p.name,
            img: p.imageUrl ?? p.img,
            price: p.price,
            description: p.description ?? p.desc ?? '',
          })),
        }))
      },
      providesTags: [{ type: 'Product', id: 'TAGS' }],
    }),

  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetBestProductsQuery,
  useGetNewProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetMainBestSellersQuery,
  useGetTagProductsQuery,
  useGetBannerSlidesQuery,
} = productApi

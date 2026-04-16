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

    /** 상품 상세 — Product Server: GET /api/v1/product/{productId} */
    getProductById: builder.query({
      query: (id) => ({ url: `/products/${id}` }),
      transformResponse: (res) => {
        const p = res.data ?? res
        const imageUrls = p.imageUrls ?? (p.imageUrl ? [p.imageUrl] : [])
        return {
          id:            p.productId ?? p.id,
          name:          p.productName ?? p.title ?? p.name,
          brand:         p.brandName  ?? p.brand,
          brandId:       p.brandId    ?? null,
          categoryId:    p.categoryId ?? null,
          category:      p.categoryName ?? p.category,
          desc:          p.content ?? p.description ?? p.desc,
          price:         p.price,
          status:        p.status ?? null,
          tags:          p.tags   ?? null,
          salesCount:    p.salesCount    ?? 0,
          stockQuantity: p.stockQuantity ?? 0,
          stockStatus:   p.stockStatus   ?? 'IN_STOCK',
          img:           imageUrls[0] ?? null,
          images:        imageUrls,
          // detaiimagelUrl — 서버 오타 그대로 수용
          detailImgs:    p.detaiimagelUrl
                           ? [p.detaiimagelUrl]
                           : (p.detailImages ?? p.detailImgs ?? []),
          options: (p.options ?? []).map((opt) => ({
            id:            opt.optionId    ?? null,
            label:         opt.optionName  ?? opt.label,
            extra:         opt.extraPrice  ?? opt.additionalPrice ?? opt.extra ?? 0,
            stockQuantity: opt.stockQuantity ?? 0,
            stockStatus:   opt.stockStatus   ?? 'IN_STOCK',
          })),
          isSubscribable:       p.isSubscribable       ?? false,
          subscriptionDiscount: p.subscriptionDiscount ?? 0,
          bundleOptions:        p.bundleOptions        ?? [],
          relatedProducts: (p.relatedProducts ?? []).map((rp) => ({
            id:           rp.productId    ?? rp.id,
            name:         rp.productName  ?? rp.title ?? rp.name,
            originalPrice: rp.originalPrice ?? rp.price,
            discountPrice: rp.discountPrice ?? null,
            img:          (rp.imageUrls?.[0]) ?? rp.imageUrl ?? rp.img,
            options:      rp.options ?? [],
          })),
        }
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
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
  useGetNewProductsQuery,
  useGetTagProductsQuery,
} = productApi

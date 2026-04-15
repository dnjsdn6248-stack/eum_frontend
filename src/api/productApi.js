import { apiSlice } from './apiSlice'

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 상품 목록 (필터·페이지네이션 포함) */
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
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
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    /** 베스트 상품 */
    getBestProducts: builder.query({
      query: (limit = 8) => ({ url: '/products/best', params: { limit } }),
      providesTags: [{ type: 'Product', id: 'BEST' }],
    }),

    /** 신상품 */
    getNewProducts: builder.query({
      query: (limit = 8) => ({ url: '/products/new', params: { limit } }),
      providesTags: [{ type: 'Product', id: 'NEW' }],
    }),

    /** 상품 검색 */
    searchProducts: builder.query({
      query: (params) => ({ url: '/products/search', params }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
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
} = productApi

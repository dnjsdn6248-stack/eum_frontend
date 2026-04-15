import { apiSlice } from './apiSlice'

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 전체 카테고리 목록 */
    getCategories: builder.query({
      query: () => ({ url: '/categories' }),
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),

  }),
})

export const {
  useGetCategoriesQuery,
} = categoryApi

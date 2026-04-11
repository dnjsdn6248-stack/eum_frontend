import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({

    // ─── Queries ────────────────────────────────────────────────────────────

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

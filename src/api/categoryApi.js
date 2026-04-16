import { apiSlice } from './apiSlice'

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 전체 카테고리 목록 — Result 래퍼 없이 배열 직접 반환 */
    getCategories: builder.query({
      query: () => ({ url: '/categories' }),
      transformResponse: (res) => {
        const items = Array.isArray(res) ? res : []
        return items
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((cat) => ({
            id: cat.categoryId,
            name: cat.name,
            displayOrder: cat.displayOrder,
            children: (cat.children ?? [])
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .map((c) => ({
                id: c.categoryId,
                name: c.name,
                displayOrder: c.displayOrder,
              })),
          }))
      },
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),

  }),
})

export const {
  useGetCategoriesQuery,
} = categoryApi

import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'
import { initCheckedItems } from '@/features/cart/cartSlice'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({

    // ─── Queries ────────────────────────────────────────────────────────────

    /** 장바구니 조회 — 성공 시 checkedItemIds 초기화 */
    getCart: builder.query({
      query: () => ({ url: '/cart' }),
      providesTags: ['Cart'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(initCheckedItems(data.map((item) => item.cartItemId)))
        } catch {}
      },
    }),

    // ─── Mutations ──────────────────────────────────────────────────────────

    /** 장바구니 상품 추가 */
    addCartItem: builder.mutation({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),

    /** 장바구니 수량 변경 */
    updateCartItem: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/items/${cartItemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    /** 장바구니 단일 상품 삭제 */
    removeCartItem: builder.mutation({
      query: (cartItemId) => ({
        url: `/cart/items/${cartItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    /** 장바구니 전체 비우기 */
    clearCart: builder.mutation({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),

  }),
})

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi

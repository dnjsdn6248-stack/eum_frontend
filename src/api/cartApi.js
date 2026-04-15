import { apiSlice } from './apiSlice'
import { initCheckedItems } from '@/features/cart/cartSlice'

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** GET /cart — 장바구니 조회 */
    getCart: builder.query({
      query: () => ({ url: '/cart' }),
      transformResponse: (res) => {
        const items = res.data?.items ?? res.data ?? []
        return items.map((item) => ({
          id: item.cartItemId ?? item.id,
          cartItemId: item.cartItemId ?? item.id,
          name: item.productName ?? item.name,
          img: item.imageUrl ?? item.img,
          price: item.price,
          qty: item.quantity ?? item.qty ?? 1,
          option: item.selectedOption ?? item.option ?? '',
          options: item.options ?? [],
          delivery: item.deliveryType ?? '',
        }))
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cart', id })),
              { type: 'Cart', id: 'LIST' },
            ]
          : [{ type: 'Cart', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(initCheckedItems(data.map((item) => item.id)))
        } catch {}
      },
    }),

    /** POST /cart/items — 상품 추가 */
    addCartItem: builder.mutation({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    /** PUT /cart/items/:cartItemId — 수량·옵션 변경 */
    updateCartItem: builder.mutation({
      query: ({ cartItemId, ...body }) => ({
        url: `/cart/items/${cartItemId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    /** DELETE /cart/items/:cartItemId — 단일 삭제 */
    removeCartItem: builder.mutation({
      query: (cartItemId) => ({
        url: `/cart/items/${cartItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    /** DELETE /cart — 전체 비우기 */
    clearCart: builder.mutation({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
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

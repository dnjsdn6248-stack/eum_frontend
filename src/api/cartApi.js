import { apiSlice } from './apiSlice'
import { initCheckedItems } from '@/features/cart/cartSlice'

/** 서버 CartResponse → 컴포넌트 수신 구조 */
const normalizeCart = (res) => ({
  cartId:                 res.cartId                ?? null,
  totalAmount:            res.totalAmount            ?? 0,
  totalProductPrice:      res.totalProductPrice      ?? 0,
  totalShippingFee:       res.totalShippingFee       ?? 0,
  estimatedPaymentAmount: res.estimatedPaymentAmount ?? 0,
  estimatedRewardPoints:  res.estimatedRewardPoints  ?? 0,
  memberRewardPoints:     res.memberRewardPoints      ?? 0,
  isSelectedAll:          res.isSelectedAll           ?? false,
  selectedItemCount:      res.selectedItemCount       ?? 0,
  remainingItemCount:     res.remainingItemCount      ?? 0,
  items: (res.items ?? []).map((item) => ({
    id:          item.cartItemId,
    cartItemId:  item.cartItemId,
    productId:   item.productId   ?? null,
    optionId:    item.optionId    ?? null,
    name:        item.productName ?? '',
    optionName:  item.optionName  ?? '',
    img:         item.imageUrl    ?? '',
    unitPrice:   item.unitPrice   ?? 0,
    totalPrice:  item.totalPrice  ?? 0,
    qty:         item.quantity    ?? 1,
    isSelected:  item.isSelected  ?? false,
    stockStatus: item.stockStatus ?? 'IN_STOCK',
  })),
})

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ── GET /cart — 장바구니 전체 조회 ─────────────────────────────────────
    getCart: builder.query({
      query: () => ({ url: '/cart' }),
      transformResponse: normalizeCart,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Cart', id })),
              { type: 'Cart', id: 'LIST' },
            ]
          : [{ type: 'Cart', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // 서버 isSelected 기준으로 체크 상태 초기화
          dispatch(initCheckedItems(
            data.items.filter((i) => i.isSelected).map((i) => i.id)
          ))
        } catch {}
      },
    }),

    // ── GET /cart/summary — 요약 조회 (헤더 배지·요약 영역용) ─────────────
    getCartSummary: builder.query({
      query: () => ({ url: '/cart/summary' }),
      transformResponse: normalizeCart,
      providesTags: [{ type: 'Cart', id: 'SUMMARY' }],
    }),

    // ── POST /cart/items — 상품 추가 ───────────────────────────────────────
    // body: { productId, quantity, optionId?, optionName?, snapshot? }
    // snapshot: { productName, unitPrice, imageUrl, stockStatus }
    addCartItem: builder.mutation({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // ── PUT /cart/select-all — 전체 선택/해제 ──────────────────────────────
    selectAllCartItems: builder.mutation({
      query: (isSelectedAll) => ({
        url: '/cart/select-all',
        method: 'PUT',
        body: { isSelectedAll },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // ── PUT /cart/{cartItemId}/select — 개별 선택/해제 ─────────────────────
    selectCartItem: builder.mutation({
      query: ({ cartItemId, isSelected }) => ({
        url: `/cart/${cartItemId}/select`,
        method: 'PUT',
        body: { isSelected },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // ── PUT /cart/{cartItemId}/quantity — 수량 변경 ─────────────────────────
    // quantity = 0 이면 서버에서 해당 아이템 삭제 처리
    updateCartItemQuantity: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/${cartItemId}/quantity`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // ── PUT /cart/{cartItemId}/option — 옵션 변경 ──────────────────────────
    // body: { optionId, optionName?, snapshot? }
    updateCartItemOption: builder.mutation({
      query: ({ cartItemId, ...body }) => ({
        url: `/cart/${cartItemId}/option`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // ── DELETE /cart/items — 선택 상품 삭제 (복수) ─────────────────────────
    // cartItemIds: number[]
    removeCartItems: builder.mutation({
      query: (cartItemIds) => ({
        url: '/cart/items',
        method: 'DELETE',
        body: { cartItemIds },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

  }),
})

export const {
  useGetCartQuery,
  useGetCartSummaryQuery,
  useAddCartItemMutation,
  useSelectAllCartItemsMutation,
  useSelectCartItemMutation,
  useUpdateCartItemQuantityMutation,
  useUpdateCartItemOptionMutation,
  useRemoveCartItemsMutation,
} = cartApi

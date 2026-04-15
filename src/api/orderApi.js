import { apiSlice } from './apiSlice'
import { setLastCreatedOrder } from '@/features/order/orderSlice'

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 주문 목록 */
    getOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ orderId }) => ({ type: 'Order', id: orderId })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    /** 주문 상세 */
    getOrderById: builder.query({
      query: (orderId) => ({ url: `/orders/${orderId}` }),
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    /** 주문 생성 — 완료 후 lastCreatedOrder 저장 */
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setLastCreatedOrder(data))
        } catch {}
      },
    }),

    /** 주문 취소 */
    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),

    /** 환불 요청 */
    refundOrder: builder.mutation({
      query: ({ orderId, body }) => ({
        url: `/orders/${orderId}/refund`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),

  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useRefundOrderMutation,
} = orderApi

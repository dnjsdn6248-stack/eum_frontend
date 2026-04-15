import { apiSlice } from './apiSlice'
import { setLastCreatedOrder } from '@/features/order/orderSlice'

const normalizeOrder = (o) => ({
  id: o.orderId ?? o.id,
  date: typeof o.createdAt === 'string' ? o.createdAt.split('T')[0] : (o.date ?? ''),
  status: o.orderStatus ?? o.status,
  items: (o.orderItems ?? o.items ?? []).map((item) => ({
    productId: item.productId,
    name: item.productName ?? item.name,
    option: item.optionName ?? item.option ?? '기본',
    qty: item.quantity ?? item.qty ?? 1,
    price: item.price,
    img: item.imageUrl ?? item.img,
  })),
  productPrice: o.productAmount ?? o.productPrice ?? 0,
  shippingPrice: o.shippingFee ?? o.shippingPrice ?? 0,
  discountPrice: o.discountAmount ?? o.discountPrice ?? 0,
  total: o.totalAmount ?? o.total ?? 0,
})

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 주문 목록 */
    getOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      transformResponse: (res) => {
        const raw = res.content ?? res.data?.content ?? []
        return {
          content: raw.map(normalizeOrder),
          totalPages: res.totalPages ?? res.data?.totalPages ?? 1,
          totalElements: res.totalElements ?? res.data?.totalElements ?? raw.length,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    /** 주문 상세 */
    getOrderById: builder.query({
      query: (orderId) => ({ url: `/orders/${orderId}` }),
      transformResponse: (res) => normalizeOrder(res.data ?? res),
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

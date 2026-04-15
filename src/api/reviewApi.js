import { apiSlice } from './apiSlice'

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /** 상품별 리뷰 목록 */
    getProductReviews: builder.query({
      query: ({ productId, params }) => ({
        url: `/products/${productId}/reviews`,
        params,
      }),
      providesTags: (result, error, { productId }) => [
        { type: 'Review', id: `PRODUCT_${productId}` },
      ],
    }),

    /** 내 리뷰 목록 */
    getMyReviews: builder.query({
      query: (params) => ({ url: '/reviews/mine', params }),
      providesTags: [{ type: 'Review', id: 'MINE' }],
    }),

    /** 리뷰 작성 */
    createReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: `PRODUCT_${productId}` },
        { type: 'Review', id: 'MINE' },
      ],
    }),

    /** 리뷰 수정 */
    updateReview: builder.mutation({
      query: ({ reviewId, reviewData }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'Review', id: reviewId },
        { type: 'Review', id: 'MINE' },
      ],
    }),

    /** 리뷰 삭제 */
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: 'Review', id: reviewId },
        { type: 'Review', id: 'MINE' },
      ],
    }),

    /** 도움돼요 */
    markReviewHelpful: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpful`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: 'Review', id: reviewId },
      ],
    }),

    /** 홈 포토리뷰 하이라이트 (메인페이지 전용) */
    getReviewHighlights: builder.query({
      query: () => ({ url: '/main/review-highlights' }),
      transformResponse: (res) => {
        const items = res.data ?? res ?? []
        return items.map((item) => ({
          id: item.id,
          img: item.reviewImageUrl ?? item.img,
          title: item.title ?? item.productName ?? '',
          rating: `★ ${item.starAverage ?? item.star ?? 0}(${item.totalReviewAmount ?? 0})`,
          href: item.reviewUrl ?? '/review',
        }))
      },
      providesTags: [{ type: 'Review', id: 'HIGHLIGHTS' }],
    }),

  }),
})

export const {
  useGetProductReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
  useGetReviewHighlightsQuery,
} = reviewApi

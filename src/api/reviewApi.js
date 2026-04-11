import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery,
  tagTypes: ['Review'],
  endpoints: (builder) => ({

    // ─── Queries ────────────────────────────────────────────────────────────

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

    // ─── Mutations ──────────────────────────────────────────────────────────

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

  }),
})

export const {
  useGetProductReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
} = reviewApi

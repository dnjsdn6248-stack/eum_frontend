import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'

/**
 * 단일 createApi 인스턴스 — 모든 도메인은 injectEndpoints로 확장
 * Mock → 실서버 전환: baseQuery 한 줄만 교체
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'Product', 'Category', 'Cart', 'Order', 'Review', 'User', 'Address'],
  endpoints: () => ({}),
})

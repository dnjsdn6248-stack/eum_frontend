import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'
import { setCredentials, clearCredentials } from '@/features/auth/authSlice'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({

    // ─── Mutations ──────────────────────────────────────────────────────────

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem('accessToken', data.accessToken)
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }))
        } catch {}
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          localStorage.removeItem('accessToken')
          dispatch(clearCredentials())
        }
      },
    }),

    updateProfile: builder.mutation({
      query: (body) => ({ url: '/auth/profile', method: 'PUT', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ user: data }))
        } catch {}
      },
    }),

    changePassword: builder.mutation({
      query: (body) => ({ url: '/auth/password', method: 'PUT', body }),
    }),

    // ─── Queries ────────────────────────────────────────────────────────────

    getMe: builder.query({
      query: () => ({ url: '/auth/me' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ user: data }))
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi

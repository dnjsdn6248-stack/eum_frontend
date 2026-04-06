import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// ─── Feature Slices (클라이언트 UI 상태) ──────────────────────────────────────
import authReducer     from '@/features/auth/authSlice'
import productReducer  from '@/features/product/productSlice'
import categoryReducer from '@/features/category/categorySlice'
import cartReducer     from '@/features/cart/cartSlice'
import orderReducer    from '@/features/order/orderSlice'
import reviewReducer   from '@/features/review/reviewSlice'
import uiReducer       from '@/features/ui/uiSlice'

// ─── RTK Query API Slices (서버 상태) ─────────────────────────────────────────
import { authApi }     from '@/api/authApi'
import { productApi }  from '@/api/productApi'
import { categoryApi } from '@/api/categoryApi'
import { cartApi }     from '@/api/cartApi'
import { orderApi }    from '@/api/orderApi'
import { reviewApi }   from '@/api/reviewApi'

export const store = configureStore({
  reducer: {
    // 클라이언트 UI 상태
    auth:     authReducer,
    product:  productReducer,
    category: categoryReducer,
    cart:     cartReducer,
    order:    orderReducer,
    review:   reviewReducer,
    ui:       uiReducer,

    // RTK Query 서버 캐시 상태
    [authApi.reducerPath]:     authApi.reducer,
    [productApi.reducerPath]:  productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [cartApi.reducerPath]:     cartApi.reducer,
    [orderApi.reducerPath]:    orderApi.reducer,
    [reviewApi.reducerPath]:   reviewApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
        ignoredPaths: ['order.lastCreatedOrder.createdAt'],
      },
    }).concat(
      authApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      reviewApi.middleware,
    ),

  devTools: import.meta.env.DEV,
})

// refetchOnFocus / refetchOnReconnect 활성화
setupListeners(store.dispatch)

export default store

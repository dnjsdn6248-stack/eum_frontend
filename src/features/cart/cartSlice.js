import { createSlice } from '@reduxjs/toolkit'

/**
 * cartSlice — 장바구니 체크 UI 상태만 관리
 *
 * 실제 장바구니 데이터(items)는 cartApi(RTK Query)의
 * useGetCartQuery 훅으로 조회합니다.
 * getCart 성공 시 onQueryStarted에서 initCheckedItems를 dispatch해
 * 초기 체크 상태를 설정합니다.
 *
 * 계산 셀렉터(totalCount, checkedTotalPrice 등)는
 * RTK Query 훅 반환값과 이 슬라이스 상태를 조합해 컴포넌트 내에서 계산하세요.
 */

const initialState = {
  /** 선택된(체크된) 장바구니 아이템 id 목록 */
  checkedItemIds: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** getCart 성공 시 cartApi.onQueryStarted에서 호출 */
    initCheckedItems(state, action) {
      state.checkedItemIds = action.payload
    },
    toggleCheckItem(state, action) {
      const id = action.payload
      if (state.checkedItemIds.includes(id)) {
        state.checkedItemIds = state.checkedItemIds.filter((i) => i !== id)
      } else {
        state.checkedItemIds.push(id)
      }
    },
    checkAllItems(state, action) {
      // action.payload: 전체 cartItemId 배열 (useGetCartQuery 결과에서 전달)
      state.checkedItemIds = action.payload
    },
    uncheckAllItems(state) {
      state.checkedItemIds = []
    },
  },
})

export const {
  initCheckedItems,
  toggleCheckItem,
  checkAllItems,
  uncheckAllItems,
} = cartSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCheckedItemIds = (state) => state.cart.checkedItemIds

export default cartSlice.reducer

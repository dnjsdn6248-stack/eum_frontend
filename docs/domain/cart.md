# Cart 도메인

기준일: 2026-04-17

## 개요

장바구니 아이템 CRUD는 `cartApi`(RTK Query), 체크박스 선택 UI 상태는 `cartSlice`가 분리해서 관리한다.  
**선택 상태(`isSelected`)는 서버가 관리** — 체크 토글 시 `PUT /cart/{cartItemId}/select`를 호출하여 서버에 반영.

---

## 비즈니스 정책

| 정책 | 근거 |
|---|---|
| 금액(합계·배송비·적립금) | **서버 계산값 우선** — `totalAmount`, `totalShippingFee`, `estimatedRewardPoints` 사용 |
| 수량 = 0 요청 | 해당 아이템 삭제로 처리 (`PUT /cart/{cartItemId}/quantity { quantity: 0 }`) |
| 동일 상품/옵션 추가 | 서버에서 수량 합산 처리 |

---

## 상태 구조

```js
// cartSlice — 체크 UI 상태 (서버 isSelected와 동기화)
cart
└── checkedItemIds: number[]    // 체크된 cartItemId 목록

// RTK Query 캐시 — 실제 아이템 + 금액 데이터
api.queries.getCart → {
  cartId, totalAmount, totalProductPrice, totalShippingFee,
  estimatedPaymentAmount, estimatedRewardPoints, memberRewardPoints,
  isSelectedAll, selectedItemCount, remainingItemCount,
  items: CartItem[]
}
```

---

## CartItem 데이터 구조 (transformResponse 후)

```js
{
  id:          number,   // cartItemId alias
  cartItemId:  number,
  productId:   number,
  optionId:    number | null,
  name:        string,   // productName
  optionName:  string,   // 선택된 옵션명
  img:         string,   // imageUrl
  unitPrice:   number,   // 단가
  totalPrice:  number,   // 단가 × 수량
  qty:         number,   // quantity
  isSelected:  boolean,  // 서버 선택 상태
  stockStatus: string,   // 'IN_STOCK' | 'OUT_OF_STOCK'
}
```

---

## API 엔드포인트 (`src/api/cartApi.js`)

`apiSlice.injectEndpoints()`로 정의. 모든 Mutation은 `invalidatesTags: [{ type: 'Cart', id: 'LIST' }]`.

### Queries

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetCartQuery()` | GET | `/cart` | 전체 조회 — 성공 시 `initCheckedItems` dispatch |
| `useGetCartSummaryQuery()` | GET | `/cart/summary` | 요약 조회 — 헤더 배지 등 부분 갱신용 |

### Mutations

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useAddCartItemMutation` | POST | `/cart/items` | 상품 추가 (`productId`, `quantity` 필수, `snapshot` 선택) |
| `useSelectAllCartItemsMutation` | PUT | `/cart/select-all` | 전체 선택/해제 `{ isSelectedAll }` |
| `useSelectCartItemMutation` | PUT | `/cart/{cartItemId}/select` | 개별 선택/해제 `{ isSelected }` |
| `useUpdateCartItemQuantityMutation` | PUT | `/cart/{cartItemId}/quantity` | 수량 변경 `{ quantity }` (0이면 삭제) |
| `useUpdateCartItemOptionMutation` | PUT | `/cart/{cartItemId}/option` | 옵션 변경 `{ optionId, optionName?, snapshot? }` |
| `useRemoveCartItemsMutation` | DELETE | `/cart/items` | 선택 상품 삭제 `{ cartItemIds: number[] }` |

---

## 체크 상태 초기화

`getCart` 성공 시 `onQueryStarted`에서 `isSelected === true`인 아이템의 id만 `initCheckedItems`로 dispatch.

```js
dispatch(initCheckedItems(
  data.items.filter(i => i.isSelected).map(i => i.id)
))
```

---

## cartSlice 액션 & 셀렉터

선택 상태는 서버가 관리하므로 `CartPage`는 Redux 선택 액션을 직접 호출하지 않는다.  
`initCheckedItems`만 `cartApi.js` 내부에서 자동 호출됨.

```js
// Actions (cartSlice)
initCheckedItems(ids[])   // ✅ cartApi onQueryStarted에서 자동 호출 — 직접 사용 금지
toggleCheckItem(id)       // ⚠️ CartPage 미사용 — 선택은 useSelectCartItemMutation으로
checkAllItems(ids[])      // ⚠️ CartPage 미사용 — 전체선택은 useSelectAllCartItemsMutation으로
uncheckAllItems()         // ⚠️ CartPage 미사용

// Selectors
selectCheckedItemIds(state)   // number[] — getCart 성공 시 isSelected 기준 동기화됨
```

---

## 선택 상태 변경 패턴

서버가 선택 상태를 관리하므로 체크박스 토글 시 반드시 API 호출 후 캐시 무효화:

```js
// 개별 토글
const [selectItem] = useSelectCartItemMutation()
await selectItem({ cartItemId, isSelected: !item.isSelected })

// 전체 선택/해제
const [selectAll] = useSelectAllCartItemsMutation()
await selectAll(!isSelectedAll)
```

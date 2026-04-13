# Cart 도메인

## 개요

장바구니 아이템의 서버 CRUD는 `cartApi`, 체크박스 선택 UI 상태는 `cartSlice`가 분리해서 관리한다.

---

## 비즈니스 정책

| 정책 | 값 | 코드 위치 |
|---|---|---|
| 무료배송 기준 | 50,000원 이상 | `src/shared/utils/constants.js` → `SHIPPING_FREE_THRESHOLD` |
| 기본 배송비 | 5,000원 | `src/shared/utils/constants.js` → `SHIPPING_FEE` |
| 적립금 적립율 | 결제금액의 1% | `src/shared/utils/constants.js` → `POINT_EARN_RATE` |

---

## 상태 구조

```js
cart (cartSlice) — 체크 UI 상태만
└── checkedItemIds: number[]    // 체크된 cartItemId 목록

cartApi (RTK Query 캐시) — 실제 아이템 데이터
└── getCart → CartItem[]
```

---

## API 엔드포인트 (`cartApi`)

`src/features/cart/cartApi.js` — `apiSlice.injectEndpoints()`로 정의.

| 훅 | 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|---|
| `useGetCartQuery()` | GET | `/cart` | 필요 | 조회 → 성공 시 `initCheckedItems` dispatch |
| `useAddCartItemMutation` | POST | `/cart/items` | 필요 | 상품 추가 |
| `useUpdateCartItemMutation` | PUT | `/cart/items/:cartItemId` | 필요 | 수량 변경 — `{ quantity }` |
| `useRemoveCartItemMutation` | DELETE | `/cart/items/:cartItemId` | 필요 | 단일 삭제 |
| `useClearCartMutation` | DELETE | `/cart` | 필요 | 전체 비우기 |

모든 Mutation은 `invalidatesTags: ['Cart']`로 `getCart`를 자동 재조회한다.

---

## 체크 상태 초기화

`getCart` 성공 시 `onQueryStarted`에서 전체 `cartItemId` 배열로 `initCheckedItems`를 dispatch → 기본 전체 체크 상태.

---

## 계산 로직

계산 함수는 `src/shared/utils/formatters.js`에 순수 함수로 정의.

```js
// 컴포넌트에서 사용 패턴
const { data: cartItems } = useGetCartQuery()
const checkedIds = useAppSelector(selectCheckedItemIds)

const checkedItems = cartItems.filter(i => checkedIds.includes(i.cartItemId))
const subTotal = calcSubTotal(checkedItems)           // formatters.js
const shipping  = calcShippingFee(subTotal)           // formatters.js
const points    = calcPointsEarned(subTotal)          // formatters.js
```

---

## 액션 & 셀렉터

```js
// Actions
initCheckedItems(cartItemIds[])   // getCart 완료 후 자동 호출
toggleCheckItem(cartItemId)
checkAllItems(cartItemIds[])
uncheckAllItems()

// Selectors
selectCheckedItemIds(state)       // number[]
```

---

## Mock 데이터

| 파일 | 내용 | 가변 여부 |
|---|---|---|
| `src/mocks/cart.js` | 초기 장바구니 아이템 | 가변 (`let cartItems = [...]`) |

`mockBaseQuery.js`에서 ADD/REMOVE/UPDATE 시 `let cartItems` 변수만 수정한다. 원본 배열 직접 변경 금지.

---

## 옵션 기능

CartItem에 `option`(현재 선택값)과 `options`(선택 가능 목록) 필드가 존재한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `option` | `string` | 현재 선택된 옵션 값. 빈 문자열이면 미선택 |
| `options` | `string[]` | 선택 가능한 옵션 목록. 빈 배열이면 옵션 없음 |

- `options` 배열이 비어 있으면 옵션 UI를 렌더링하지 않는다.
- 옵션 변경 시 해당 cartItem의 `option` 값만 업데이트한다.
- 실서버 전환 시 옵션 변경은 `useUpdateCartItemMutation` — `{ optionId }` 또는 `{ optionName }` 으로 전달 예정.

---

## 현재 구현 vs. 목표

| 항목 | 현재 코드 | 목표 |
|---|---|---|
| 장바구니 데이터 | `useState(MOCK_CART)` 로컬 상태 | `useGetCartQuery` + `cartSlice` |
| 체크 상태 | 로컬 `checked` 필드 | `cartSlice.checkedItemIds` |
| 계산 로직 | 컴포넌트 내 인라인 계산 | `formatters.js` 순수 함수 |
| API 구조 | 독립 `createApi` (`cartApi.js`) | `apiSlice.injectEndpoints()` |
| 옵션 변경 | 로컬 `option` 필드 업데이트 | `useUpdateCartItemMutation({ optionId })` |

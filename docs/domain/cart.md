# Cart 도메인

기준일: 2026-04-15

## 개요

장바구니 아이템의 서버 CRUD는 `cartApi`(RTK Query), 체크박스 선택 UI 상태는 `cartSlice`가 분리해서 관리한다.

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
// cartSlice — 체크 UI 상태만
cart
└── checkedItemIds: number[]    // 체크된 cartItemId 목록

// RTK Query 캐시 — 실제 아이템 데이터
api.queries.getCart → CartItem[]
```

---

## CartItem 데이터 구조

```js
{
  id: number,           // cartItemId alias
  cartItemId: number,
  name: string,
  img: string,
  price: number,
  qty: number,          // quantity
  option: string,       // 현재 선택된 옵션값 (빈 문자열이면 미선택)
  options: string[],    // 선택 가능한 옵션 목록 (빈 배열이면 옵션 없음)
  delivery: string,     // deliveryType
}
```

---

## API 엔드포인트 (`src/api/cartApi.js`)

`apiSlice.injectEndpoints()`로 정의.

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetCartQuery()` | GET | `/cart` | 조회 — 성공 시 `initCheckedItems` dispatch (전체 체크 기본값) |
| `useAddCartItemMutation` | POST | `/cart/items` | 상품 추가 |
| `useUpdateCartItemMutation` | PUT | `/cart/items/:cartItemId` | 수량·옵션 변경 — `{ cartItemId, ...body }` |
| `useRemoveCartItemMutation` | DELETE | `/cart/items/:cartItemId` | 단일 삭제 |
| `useClearCartMutation` | DELETE | `/cart` | 전체 비우기 |

모든 Mutation은 `invalidatesTags: [{ type: 'Cart', id: 'LIST' }]`로 `getCart`를 자동 재조회한다.

---

## 체크 상태 초기화

`getCart` 성공 시 `onQueryStarted`에서 전체 `id` 배열로 `initCheckedItems`를 dispatch → 기본 전체 체크 상태.

---

## 계산 로직

계산 함수는 `src/shared/utils/formatters.js`에 순수 함수로 정의.

```js
const { data: cartItems } = useGetCartQuery()
const checkedIds = useAppSelector(selectCheckedItemIds)

const checkedItems = cartItems.filter(i => checkedIds.includes(i.id))
const subTotal = calcSubTotal(checkedItems)
const shipping  = calcShippingFee(subTotal)
const points    = calcPointsEarned(subTotal)
```

---

## 액션 & 셀렉터

```js
// Actions (cartSlice)
initCheckedItems(ids[])     // getCart 완료 후 자동 호출
toggleCheckItem(id)
checkAllItems(ids[])
uncheckAllItems()

// Selectors
selectCheckedItemIds(state) // number[]
```

---

## 옵션 기능

| 필드 | 타입 | 설명 |
|---|---|---|
| `option` | `string` | 현재 선택된 옵션 값. 빈 문자열이면 미선택 |
| `options` | `string[]` | 선택 가능한 옵션 목록. 빈 배열이면 옵션 없음 |

- `options`가 비어 있으면 옵션 UI를 렌더링하지 않는다.
- 옵션 변경 시 `useUpdateCartItemMutation` 호출 예정.

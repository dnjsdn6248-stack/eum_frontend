# Product 도메인

## 개요

상품 목록 조회, 상세 조회, 검색, 베스트/신상품 조회를 담당한다. 카테고리(Category)는 상품 필터링과 긴밀하게 연결되어 이 문서에서 함께 다룬다.

---

## 비즈니스 정책

| 정책 | 값 | 코드 위치 |
|---|---|---|
| 기본 페이지 크기 | 12개 | `src/shared/utils/constants.js` → `PRODUCT_PAGE_SIZE` |
| 배송비 기준 | 50,000원 이상 무료 | `src/shared/utils/constants.js` → `SHIPPING_FREE_THRESHOLD` |
| 기본 배송비 | 5,000원 | `src/shared/utils/constants.js` → `SHIPPING_FEE` |

> 비즈니스 수치는 컴포넌트 하드코딩 금지 — `constants.js`에서만 정의하고 import.

---

## 상태 구조

```js
// Redux slice (productSlice) — UI 상태만
product
├── searchKeyword: string
├── pagination: { page: 1, size: PRODUCT_PAGE_SIZE }
└── filters
    ├── categoryId:  number | null
    ├── petType:     'DOG'|'CAT'|'ALL' | null
    ├── ageGroup:    null
    ├── weightClass: null
    ├── minPrice / maxPrice: null
    ├── sortBy:      'createdAt'|'price'|'rating'|'sales'
    └── sortDir:     'asc'|'desc'

category (categorySlice) — 선택된 카테고리 ID만
└── selectedCategoryId: number | null
```

서버에서 내려온 상품 데이터는 RTK Query 캐시에만 존재한다.

---

## API 엔드포인트 (`productsApi`)

`src/features/products/productsApi.js` — `apiSlice.injectEndpoints()`로 정의.

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetProductsQuery(params)` | GET | `/products` | 목록 — `filters + pagination` 파라미터 |
| `useGetProductByIdQuery(id)` | GET | `/products/:id` | 상세 |
| `useGetBestProductsQuery(limit?)` | GET | `/products/best` | 베스트 (기본 8개) |
| `useGetNewProductsQuery(limit?)` | GET | `/products/new` | 신상품 (기본 8개) |
| `useSearchProductsQuery(params)` | GET | `/products/search` | 검색 |
| `useLazySearchProductsQuery` | GET | `/products/search` | 검색창 입력 지연 트리거용 |

`getProducts` 응답 형태: `{ content: Product[], totalPages, totalElements, ... }`

---

## 카테고리 API

`src/features/products/categoryApi.js` (또는 `productsApi.js` 내 통합)

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetCategoriesQuery()` | GET | `/categories` | 전체 목록 — 앱 init 시 호출 |

---

## 필터 → RTK Query 연동 패턴

```js
const filters = useAppSelector(selectProductFilters)
const { page, size } = useAppSelector(selectProductPagination)

const { data } = useGetProductsQuery({ ...filters, page, size })
```

`setFilters` 호출 시 `pagination.page`가 자동으로 1로 리셋된다.

---

## 상품 상세 페이지 (`ProductDetailPage`)

- 경로: `/product/detail/:id` (일반) / `/subscription/detail/:id` (정기배송) — **동일 컴포넌트 사용**
- `product.isSubscribable` 필드로 UI 전체 분기:

| 필드 | 타입 | 설명 |
|---|---|---|
| `isSubscribable` | `boolean` | `true` → 정기배송 UI, `false` → 일반 구매 UI |
| `subscriptionDiscount` | `number` | 정기배송 선택 시 할인 금액 (isSubscribable=true 전용) |
| `bundleOptions` | `{ qty, price, save }[]` | 수량별 패키지 가격 (isSubscribable=true 전용) |
| `relatedProducts` | 상품 배열 | 함께 구매하면 좋은 제품 (isSubscribable=false 전용) |

### isSubscribable = false (일반 상품)
- 옵션 선택 → 수량 스텝퍼(+/-) → 총 금액 = `(price + optionExtra) × qty`
- "함께 구매하면 좋은 제품" 섹션 표시
- CTA: 장바구니 / 구매하기

### isSubscribable = true (정기배송 가능 상품)
- 구매방법 라디오: 정기배송(할인) / 1회구매
- 정기배송 선택 시 배송주기 select (1주/2주/1개월)
- 옵션 선택 → 번들 수량 그리드(1/2/4/6/10개)
- 총 금액 = `bundleOptions[selectedQty].price + optionExtra - (정기배송 ? subscriptionDiscount : 0)`
- CTA: 장바구니 / 정기배송 신청하기 or 지금 바로 구매하기

---

## Mock 데이터

| 파일 | 내용 | 가변 여부 |
|---|---|---|
| `src/mocks/products.js` | 상품 목록 | 불변 |
| `src/mocks/categories.js` | 카테고리 목록 | 불변 |

컴포넌트에서 `src/mocks/` 직접 import 금지 — `mockBaseQuery.js`가 RTK Query 훅 인터페이스를 통해 제공.

---

## 현재 구현 vs. 목표

| 항목 | 현재 코드 | 목표 |
|---|---|---|
| 상품 데이터 | 컴포넌트에서 `src/mock/index.js` 직접 import | `mockBaseQuery.js` 경유 RTK Query 훅 |
| API 구조 | 독립 `createApi` (`productApi.js`) | `apiSlice.injectEndpoints()` |
| 비즈니스 상수 | 컴포넌트 내 하드코딩 | `constants.js` |
| 라우트 | `/product/detail/:id` | `/products/:id` |

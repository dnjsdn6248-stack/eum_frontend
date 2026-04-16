# Search 도메인

기준일: 2026-04-16

## 개요

별도 Search Server(`/api/v1/search/**`)가 제공하는 검색·추천·랭킹 API를 담당한다.  
RTK Query 엔드포인트는 `src/api/searchApi.js`(`injectEndpoints`)에 정의한다.

---

## Base Path

| 환경 | URL |
|---|---|
| Gateway 경유 | `{VITE_API_BASE_URL}/v1/search/` |
| 예시 (로컬) | `http://localhost:8080/api/v1/search/` |

---

## 공통 응답 포맷

```json
{
  "status": "success",
  "totalElements": 100,
  "totalPages": 9,
  "currentPage": 0,
  "size": 12,
  "isFirst": true,
  "isLast": false,
  "hasNext": true,
  "hasPrevious": false,
  "extra": {},
  "data": []
}
```

---

## 엔드포인트 목록

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useSearchProductsQuery` | GET | `/v1/search/products` | 상품 검색 (필터·페이지) |
| `useGetSubscriptionProductsQuery` | GET | `/v1/search/products/subscription` | 정기배송 상품 목록 |
| `useGetBestsellerProductsQuery` | GET | `/v1/search/products/bestseller` | 베스트셀러 (랭킹) |
| `useGetHomeBestsellerQuery` | GET | `/v1/search/products/home-bestseller` | 홈 베스트셀러 섹션 (기본 3개) |
| `useGetSimilarProductsQuery` | GET | `/v1/search/products/{productId}/similar` | 유사 상품 추천 |
| `useGetAutocompleteQuery` | GET | `/v1/search/products/autocomplete` | 검색어 자동완성 |
| `useGetTrendingKeywordsQuery` | GET | `/v1/search/products/trending` | 인기 검색어 |
| `useSearchReviewsQuery` | GET | `/v1/search/reviews` | 리뷰 검색 |
| `useSearchNoticesQuery` | GET | `/v1/search/notices` | 공지 검색 |
| `useGetMainBannersQuery` | GET | `/v1/search/products/main-banners` | 메인 히어로 배너 (3개) |

---

## 상품 검색 (`/v1/search/products`)

### Query 파라미터
| 파라미터 | 설명 | 기본값 |
|---|---|---|
| `title` | 상품명 검색어 | - |
| `keyword` | 보조 검색어 | - |
| `category` | 대카테고리 (문자열) | `ALL` |
| `subCategory` | 소카테고리 | - |
| `sortType` | 최신순 / 판매량순 / 가격 높은순 / 가격 낮은순 | - |
| `page` | 페이지 번호 (0-based) | `0` |

### data[] 필드
```js
{
  id, imageUrl, productTitle, originalPrice, price,
  discountRate, discountTag, isNew, productTag,
  productUrl, category
}
```

### normalizeSearchProduct 변환
```js
{
  id:            item.id,
  name:          item.productTitle,
  img:           item.imageUrl,
  price:         item.price,
  originalPrice: item.originalPrice,
  discountRate:  item.discountRate,
  discountTag:   item.discountTag,
  isNew:         item.isNew,
  productTag:    item.productTag,
  productUrl:    item.productUrl,
  category:      item.category,
}
```

---

## 홈 베스트셀러 (`/v1/search/products/home-bestseller`)

### Query 파라미터
| 파라미터 | 기본값 | 설명 |
|---|---|---|
| `size` | `3` | 노출 개수 |

### data[] 필드
`rank`, `id`, `imageUrl`, `productTitle`, `price`, `score`, `salesCount`, `createdAt`, `productUrl`

---

## 베스트셀러 (`/v1/search/products/bestseller`)

현재 구현은 검색 랭킹 기반 (실판매량 집계 아님).

### data[] 필드
`id`, `imageUrl`, `productTitle`, `price`, `salesRank`, `rankTag`, `productUrl`

---

## 메인 배너 (`/v1/search/products/main-banners`)

최신 상품 이미지 기준 3개 반환. `isHero`는 항상 `true`.

### data[] 필드
`productId`, `imageUrl`, `displayOrder`, `isHero`

컴포넌트에서 사용할 정규화 형태:
```js
{ id: item.productId, img: item.imageUrl, href: item.productUrl ?? `/product/detail/${item.productId}`, displayOrder: item.displayOrder }
```

---

## 유사 상품 추천 (`/v1/search/products/{productId}/similar`)

상세 페이지 "이런 제품은 어때요?" 섹션 전용. `size=3` 고정 권장.

### data[] 필드
`productId`, `imageUrl`, `title`, `tags`, `price`

`tags[]` 우선순위: `[NEW]` → `[판매 1위/2위/3위]`

---

## 자동완성 (`/v1/search/products/autocomplete`)

### Query: `name`
### 응답: `[{ id, title }]`

---

## 인기 검색어 (`/v1/search/products/trending`)

### 응답: `[{ rank, keyword, score }]`

---

## 정기배송 상품 (`/v1/search/products/subscription`)

### data[] 필드
`id`, `imageUrl`, `productTitle`, `price`, `productUrl`

---

## 리뷰 검색 (`/v1/search/reviews`)

> 상품 리뷰 목록(`/products/{id}/reviews`)과 다름 — 전체 검색 전용.

### Query 파라미터
| 파라미터 | 설명 |
|---|---|
| `productId` | 상품 ID 필터 |
| `keyword` | 내용/작성자 검색어 |
| `sortType` | `BEST` 또는 최신순 |
| `reviewType` | `ALL` / `PHOTO` / `IMAGE` / `VIDEO` / `TEXT` |
| `page`, `size` | 페이징 (기본 `0`, `5`) |

---

## 공지 검색 (`/v1/search/notices`)

### Query 파라미터
`searchRange` (전체/일주일/한달/세달), `searchType`, `keyword`, `page`, `size`

---

## productApi.js 에서 이전된 엔드포인트

| 구 엔드포인트 | 구 경로 | 이전 후 |
|---|---|---|
| `getBannerSlides` | `/main/banners` | `getMainBanners` → `/v1/search/products/main-banners` |
| `getMainBestSellers` | `/main/best-sellers` | `getHomeBestseller` → `/v1/search/products/home-bestseller` |
| `getBestProducts` | `/products/best` | `getBestsellerProducts` → `/v1/search/products/bestseller` |
| `searchProducts` | `/products/search` | `searchProducts` → `/v1/search/products` |

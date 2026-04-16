# RTK Query API Hooks 명세

기준일: 2026-04-16

프로젝트의 모든 RTK Query 훅 상세 명세. 단일 `createApi`(`src/api/apiSlice.js`)에 `injectEndpoints`로 도메인별 주입.

> 비즈니스 정책·상태 구조·캐시 전략 상세는 `docs/domain/*.md` 참조.

---

## 공통 사항

### Request Headers (전체 공통)

| 헤더 | 값 | 설명 |
|---|---|---|
| `Cookie` | `access_token=...; refresh_token=...` | HttpOnly 쿠키 — 브라우저 자동 전송 |
| `X-XSRF-TOKEN` | `{XSRF-TOKEN 쿠키 값}` | CSRF 방어 — **Mutation 전용** (POST·PUT·DELETE) |
| `Content-Type` | `application/json` | Body가 있는 요청에만 적용 |

### Response Headers (전체 공통)

| 헤더 | 값 | 설명 |
|---|---|---|
| `Content-Type` | `application/json` | 일반 응답 |
| `Set-Cookie` | `access_token=...; HttpOnly` | 로그인·토큰 갱신 시만 서버가 세팅 |

### 공통 응답 래퍼

```json
{
  "message": "성공 메시지",
  "status": 200,
  "data": {}
}
```

> 예외: 카테고리 API는 래퍼 없이 본문 직접 반환.

---

## Auth (`src/api/authApi.js`)

---

### `useGetCsrfQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/api/v1/csrf` |

**Request**
- Parameters: 없음
- Body: 없음

**Response**
- Status: `200`
- Body: 없음 (Set-Cookie로 XSRF-TOKEN 발급)
- Headers: `Set-Cookie: XSRF-TOKEN={value}; Path=/`

---

### `useGetMeQuery` / `useLazyGetMeQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/users/me` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body**
```json
{
  "status": 200,
  "data": {
    "userId": 1,
    "name": "홍길동",
    "email": "user@example.com",
    "phoneNumber": "010-1234-5678",
    "smsAllowed": true,
    "emailAllowed": false,
    "updatedAt": "2026-04-16T00:00:00"
  }
}
```

> `transformResponse`: `res.data` 추출 → 컴포넌트는 `data` 필드 직접 수신.  
> Cache Tag: `['Auth']`

---

### `useGetTermsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/auth/terms` |

**Request**
- Parameters: 없음
- Body: 없음
- 인증: 불필요

**Response Body**
```json
{
  "terms": [
    { "id": "service_terms",   "title": "서비스 이용약관",        "content": "...", "isRequired": true,  "version": "1.0" },
    { "id": "privacy_policy",  "title": "개인정보보호정책",        "content": "...", "isRequired": true,  "version": "1.0" },
    { "id": "marketing_sms",   "title": "SMS 마케팅 정보 수신",    "content": "...", "isRequired": false, "version": "1.0" },
    { "id": "marketing_email", "title": "이메일 마케팅 정보 수신", "content": "...", "isRequired": false, "version": "1.0" }
  ]
}
```

---

### `useGetSocialAccountsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/auth/social/accounts` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body**
```json
{
  "status": 200,
  "data": [
    { "provider": "GOOGLE", "linkedAt": "2026-04-01T00:00:00" }
  ]
}
```

> Cache Tag: `['Auth']`

---

### `useLazyStartSocialLinkQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/auth/social/link/start` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `provider` | string | Y | `GOOGLE` \| `KAKAO` \| `NAVER` |

**Response Body**
```json
{
  "status": 200,
  "data": { "authUrl": "https://accounts.google.com/o/oauth2/auth?..." }
}
```

> 응답의 `authUrl`로 브라우저 리다이렉트 필요.

---

### `useLoginMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/auth/login` |

**Request Body**
```json
{
  "username": "testuser",
  "password": "TestPass1234!"
}
```

**Response**
- Status: `200`
- Body: 없음 (토큰은 Set-Cookie로만 전달)
- Headers: `Set-Cookie: access_token=...; HttpOnly`, `Set-Cookie: refresh_token=...; HttpOnly`

> 성공 후 `getMe` forceRefetch 자동 실행.

---

### `useSignupMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/auth/signup` |

**Request Body**
```json
{
  "username": "testuser",
  "name": "홍길동",
  "email": "test@example.com",
  "password": "TestPass1234!",
  "phoneNumber": "010-1234-5678",
  "termsAgreed": {
    "service_terms": true,
    "privacy_policy": true,
    "marketing_sms": false,
    "marketing_email": false
  }
}
```

> 비밀번호 규칙: 8~20자, 대·소문자 + 숫자 + 특수문자(`@$!%*?&`) 각 1개 이상.

**Response Body**
```json
{ "status": 201, "message": "회원가입 성공" }
```

---

### `useLogoutMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/auth/logout` |

**Request**
- Body: 없음

**Response**
- Status: `200`
- 서버가 HttpOnly 쿠키 만료 처리

> 성공·실패 무관하게 `dispatch(logout())` 실행.

---

### `useSendEmailVerifyMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/auth/email/send` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string | Y | 인증 코드를 발송할 이메일 주소 |

**Request Body**: 없음

**Response Body**
```json
{ "status": 200, "message": "인증 코드 발송 완료" }
```

---

### `useVerifyEmailMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/auth/email/verify` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string | Y | 이메일 주소 |
| `code` | string | Y | 발송된 인증 코드 |

**Request Body**: 없음

**Response Body**
```json
{ "status": 200, "message": "인증 완료" }
```

---

### `useUnlinkSocialMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/auth/social/unlink` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `provider` | string | Y | `GOOGLE` \| `KAKAO` \| `NAVER` |

**Request Body**: 없음

**Response Body**
```json
{ "status": 200, "message": "연동 해제 완료" }
```

> `invalidatesTags: ['Auth']`

---

## Category (`src/api/categoryApi.js`)

---

### `useGetCategoriesQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/categories` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body** (래퍼 없이 직접 반환)
```json
[
  {
    "categoryId": 1,
    "name": "사료",
    "displayOrder": 0,
    "children": [
      { "categoryId": 11, "name": "건식사료", "displayOrder": 0, "children": [] }
    ]
  }
]
```

> Cache Tag: `[{ type: 'Category', id: 'LIST' }]`

---

## Product (`src/api/productApi.js`)

---

### `useGetProductsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/products` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| `categoryId` | number | N | — | 카테고리 필터 |
| `isSubscribable` | boolean | N | — | 정기배송 가능 필터 |
| `page` | number | N | `0` | 페이지 번호 |
| `size` | number | N | `10` | 페이지 크기 |
| `sort` | string | N | — | 예: `createdDate,desc` |

**Response Body**
```json
{
  "status": 200,
  "data": {
    "content": [
      {
        "productId": 1,
        "productName": "사료명",
        "productUrl": "/product/1",
        "price": 30000,
        "discountPrice": 27000,
        "priceDisplay": "27,000원",
        "mainImageUrl": "https://...",
        "tags": ["강아지", "건식"],
        "isSubscribable": true,
        "stockQuantity": 100,
        "stockStatus": "IN_STOCK"
      }
    ],
    "totalPages": 5,
    "totalElements": 48
  }
}
```

> `transformResponse`: `content[]`를 `normalizeProduct`로 변환.  
> Cache Tag: `[{ type: 'Product', id }, ..., { type: 'Product', id: 'LIST' }]`

---

### `useGetProductByIdQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/products/:id` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | number | Y | 상품 ID |

**Response Body**
```json
{
  "status": 200,
  "data": {
    "productId": 1,
    "productName": "사료명",
    "categoryName": "건식사료",
    "brandName": "브랜드",
    "brandId": 10,
    "content": "상품 설명",
    "price": 30000,
    "discountPrice": 27000,
    "priceDisplay": "27,000원",
    "rewardRate": 1,
    "tier1Quantity": 2, "tier1Rate": 5,
    "tier2Quantity": 4, "tier2Rate": 10,
    "status": "ACTIVE",
    "tags": ["강아지"],
    "keywords": ["사료", "건식"],
    "salesCount": 320,
    "isSubscribable": true,
    "deliveryFee": 0,
    "deliveryMethod": "PARCEL",
    "stockQuantity": 100,
    "stockStatus": "IN_STOCK",
    "imageUrls": ["https://..."],
    "options": [{ "optionId": 1, "optionName": "1kg", "extraPrice": 0 }]
  }
}
```

> `transformResponse` 후 컴포넌트 수신 구조: `{ id, name, brand, desc, price, img, images, options, detailImgs, isSubscribable, subscriptionDiscount, bundleOptions, relatedProducts }`.  
> Cache Tag: `[{ type: 'Product', id }]`

---

### `useGetBestProductsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/products/best` |

**Request Query Parameters**: `params` 객체 (선택, 서버 스펙에 따라 가변)

**Response Body**
```json
{
  "status": 200,
  "data": [ { "productId": 1, "productName": "...", "price": 30000, "imageUrl": "..." } ]
}
```

> Cache Tag: `[{ type: 'Product', id: 'BEST' }]`

---

### `useGetNewProductsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/products/new` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| `limit` | number | N | `8` | 조회 개수 |

**Response Body**
```json
{
  "status": 200,
  "data": [ { "productId": 1, "productName": "...", "price": 30000 } ]
}
```

> Cache Tag: `[{ type: 'Product', id: 'NEW' }]`

---

### `useSearchProductsQuery` / `useLazySearchProductsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/products/search` |

**Request Query Parameters**: `params` 객체 (keyword 등 서버 스펙에 따라 가변)

**Response Body**
```json
{
  "content": [ { "productId": 1, "productName": "..." } ],
  "totalPages": 2,
  "totalElements": 15
}
```

> Cache Tag: `[{ type: 'Product', id: 'SEARCH' }]`

---

### `useGetBannerSlidesQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/api/v1/product/home/banners` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body (서버 원본)**
```json
{
  "status": 200,
  "data": [
    {
      "bannerId": 1,
      "imageUrl": "https://...",
      "displayOrder": 0,
      "originalFilename": "banner1.jpg"
    }
  ]
}
```

**컴포넌트 수신값** (`transformResponse` 후)
```json
[
  { "id": 1, "img": "https://...", "alt": "", "href": "#" }
]
```

> Cache Tag: `[{ type: 'Product', id: 'BANNERS' }]`

---

### `useGetMainBestSellersQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/main/best-sellers` |

**Request**
- Parameters: 없음
- Body: 없음

**컴포넌트 수신값** (`transformResponse` 후)
```json
[
  { "id": 1, "name": "사료명", "img": "https://...", "price": 30000, "productUrl": "/product/1" }
]
```

> Cache Tag: `[{ type: 'Product', id: 'MAIN_BEST' }]`

---

### `useGetTagProductsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/main/tag-products` |

**Request**
- Parameters: 없음
- Body: 없음

**컴포넌트 수신값** (`transformResponse` 후)
```json
[
  {
    "tagName": "#강아지간식",
    "products": [
      { "id": 1, "name": "사료명", "img": "https://...", "price": 30000, "description": "..." }
    ]
  }
]
```

> Cache Tag: `[{ type: 'Product', id: 'TAGS' }]`

---

## Cart (`src/api/cartApi.js`)

---

### `useGetCartQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/cart` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body (서버 원본)**
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "cartItemId": 10,
        "productName": "사료명",
        "imageUrl": "https://...",
        "price": 27000,
        "quantity": 2,
        "selectedOption": "1kg",
        "options": ["1kg", "2kg"],
        "deliveryType": "PARCEL"
      }
    ]
  }
}
```

**컴포넌트 수신값** (`transformResponse` 후)
```json
[
  { "id": 10, "cartItemId": 10, "name": "사료명", "img": "https://...", "price": 27000, "qty": 2, "option": "1kg", "options": ["1kg","2kg"], "delivery": "PARCEL" }
]
```

> 성공 시 `initCheckedItems(ids[])` 자동 dispatch.  
> Cache Tag: `[{ type: 'Cart', id }, ..., { type: 'Cart', id: 'LIST' }]`

---

### `useAddCartItemMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/cart/items` |

**Request Body**
```json
{ "productId": 1, "optionId": 10, "quantity": 2 }
```

**Response Body**
```json
{ "status": 201, "message": "장바구니에 추가되었습니다." }
```

> `invalidatesTags: [{ type: 'Cart', id: 'LIST' }]`

---

### `useUpdateCartItemMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `PUT` |
| **URL** | `/cart/items/:cartItemId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `cartItemId` | number | Y | 장바구니 아이템 ID |

**Request Body**
```json
{ "quantity": 3, "optionId": 10 }
```

**Response Body**
```json
{ "status": 200, "message": "수정되었습니다." }
```

> `invalidatesTags: [{ type: 'Cart', id: 'LIST' }]`

---

### `useRemoveCartItemMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/cart/items/:cartItemId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `cartItemId` | number | Y | 장바구니 아이템 ID |

**Request Body**: 없음

**Response**: `204 No Content`

> `invalidatesTags: [{ type: 'Cart', id: 'LIST' }]`

---

### `useClearCartMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/cart` |

**Request Body**: 없음

**Response**: `204 No Content`

> `invalidatesTags: [{ type: 'Cart', id: 'LIST' }]`

---

## Order (`src/api/orderApi.js`)

---

### `useGetOrdersQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/orders` |

**Request Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `page` | number | N | 페이지 번호 |
| `size` | number | N | 페이지 크기 |
| `status` | string | N | 주문 상태 필터 (`PENDING` \| `PREPARING` \| ...) |
| `period` | string | N | 기간 필터 |

**컴포넌트 수신값** (`normalizeOrder` 후)
```json
{
  "content": [
    {
      "id": 100,
      "date": "2026-04-16",
      "status": "배송완료",
      "items": [{ "productId": 1, "name": "사료명", "option": "1kg", "qty": 2, "price": 27000, "img": "https://..." }],
      "productPrice": 54000,
      "shippingPrice": 0,
      "discountPrice": 0,
      "total": 54000
    }
  ],
  "totalPages": 3,
  "totalElements": 25
}
```

> Cache Tag: `[{ type: 'Order', id }, ..., { type: 'Order', id: 'LIST' }]`

---

### `useGetOrderByIdQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/orders/:orderId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `orderId` | number | Y | 주문 ID |

**컴포넌트 수신값**: `useGetOrdersQuery`의 단일 항목과 동일 구조.

> Cache Tag: `[{ type: 'Order', id: orderId }]`

---

### `useCreateOrderMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/orders` |

**Request Body**
```json
{
  "items": [{ "productId": 1, "optionId": 10, "quantity": 2 }],
  "deliveryInfo": {
    "recipientName": "홍길동",
    "phoneNumber": "010-1234-5678",
    "postcode": "06234",
    "baseAddress": "서울특별시 강남구",
    "detailAddress": "101동 101호",
    "deliveryMessage": "문 앞에 놔주세요"
  },
  "paymentMethod": "CARD",
  "couponId": null,
  "discountCode": null,
  "usedPoints": 0
}
```

**Response Body**
```json
{ "status": 201, "data": { "orderId": 100, "totalAmount": 54000 } }
```

> 성공 후 `setLastCreatedOrder` dispatch.  
> `invalidatesTags: [{ type: 'Order', id: 'LIST' }]`

---

### `useCancelOrderMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `PUT` |
| **URL** | `/orders/:orderId/cancel` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `orderId` | number | Y | 주문 ID |

**Request Body**
```json
{ "reason": "단순 변심" }
```

**Response Body**
```json
{ "status": 200, "message": "주문이 취소되었습니다." }
```

> `invalidatesTags: [{ type: 'Order', id: orderId }]`

---

### `useRefundOrderMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `PUT` |
| **URL** | `/orders/:orderId/refund` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `orderId` | number | Y | 주문 ID |

**Request Body**
```json
{ "reason": "상품 불량", "refundType": "REFUND" }
```

**Response Body**
```json
{ "status": 200, "message": "환불 요청이 접수되었습니다." }
```

> `invalidatesTags: [{ type: 'Order', id: orderId }]`

---

## Review (`src/api/reviewApi.js`)

---

### `useGetProductReviewsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/products/:productId/reviews` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `productId` | number | Y | 상품 ID |

**Request Query Parameters** (`params` 객체)
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `page` | number | N | 페이지 번호 |
| `size` | number | N | 페이지 크기 |
| `sortBy` | string | N | `createdAt` \| `rating` \| `helpful` |

**Response Body**
```json
{
  "status": 200,
  "data": {
    "averageRating": 4.5,
    "totalCount": 32,
    "ratingDistribution": { "5": 20, "4": 8, "3": 3, "2": 1, "1": 0 },
    "content": [
      {
        "id": 1, "productId": 1, "orderId": 100,
        "userId": 5, "userName": "홍*동",
        "profileImage": "https://...",
        "rating": 5, "content": "정말 좋아요",
        "images": ["https://..."], "video": null,
        "tags": { "preference": 3, "repurchase": 3, "freshness": 3 },
        "helpfulCount": 12, "isHelpful": false, "isMyReview": false,
        "createdAt": "2026-04-10T12:00:00", "updatedAt": "2026-04-10T12:00:00"
      }
    ]
  }
}
```

> Cache Tag: `[{ type: 'Review', id: 'PRODUCT_{productId}' }]`

---

### `useGetMyReviewsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/reviews/mine` |

**Request Query Parameters**: `params` 객체 (page, size 등)

**Response Body**: `useGetProductReviewsQuery`의 `content[]`와 동일 구조.

> Cache Tag: `[{ type: 'Review', id: 'MINE' }]`

---

### `useGetReviewHighlightsQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/main/review-highlights` |

**Request**
- Parameters: 없음
- Body: 없음

**컴포넌트 수신값** (`transformResponse` 후)
```json
[
  { "id": 1, "img": "https://...", "title": "상품명", "rating": "★ 4.8(32)", "href": "/review" }
]
```

> Cache Tag: `[{ type: 'Review', id: 'HIGHLIGHTS' }]`

---

### `useCreateReviewMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/products/:productId/reviews` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `productId` | number | Y | 상품 ID |

**Request Body** (FormData)
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `orderId` | number | Y | 주문 ID |
| `rating` | number | Y | 1~5 정수 |
| `content` | string | Y | 최소 10자 ~ 최대 1,000자 |
| `images` | file[] | N | 최대 10장 (jpg·jpeg·png·webp, 장당 최대 10MB) |
| `video` | file | N | 최대 1개 (mp4·mov·avi·webm, 최대 500MB) |
| `tags[preference]` | number | N | `1`\|`2`\|`3` |
| `tags[repurchase]` | number | N | `1`\|`2`\|`3` |
| `tags[freshness]` | number | N | `1`\|`2`\|`3` |

**Response Body**
```json
{ "status": 201, "message": "리뷰가 등록되었습니다." }
```

> `invalidatesTags: ['PRODUCT_{productId}', 'MINE']`

---

### `useUpdateReviewMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `PUT` |
| **URL** | `/reviews/:reviewId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `reviewId` | number | Y | 리뷰 ID |

**Request Body**: `useCreateReviewMutation`과 동일 구조 (FormData)

> `invalidatesTags: [reviewId, 'MINE']`

---

### `useDeleteReviewMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/reviews/:reviewId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `reviewId` | number | Y | 리뷰 ID |

**Request Body**: 없음

**Response**: `204 No Content`

> `invalidatesTags: [reviewId, 'MINE']`

---

### `useMarkReviewHelpfulMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/reviews/:reviewId/helpful` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `reviewId` | number | Y | 리뷰 ID |

**Request Body**: 없음

**Response Body**
```json
{ "status": 200, "message": "도움돼요 처리되었습니다." }
```

> `invalidatesTags: [{ type: 'Review', id: reviewId }]`

---

## User (`src/api/userApi.js`)

---

### `useGetProfileQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/users/profile` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body**
```json
{
  "status": 200,
  "data": {
    "points": 1200,
    "couponCount": 3,
    "orderCount": 15,
    "reviewCount": 8
  }
}
```

> `transformResponse`: `res.data` 추출.  
> Cache Tag: `['User']`

---

### `useUpdateProfileMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `PUT` |
| **URL** | `/users/profile` |

**Request Body**
```json
{
  "name": "홍길동",
  "phoneNumber": "010-1234-5678",
  "email": "user@example.com",
  "currentPassword": "OldPass1!",
  "newPassword": "NewPass1!",
  "confirmPassword": "NewPass1!",
  "marketingConsent": {
    "smsAllowed": true,
    "emailAllowed": false
  }
}
```

**Response Body**
```json
{ "status": 200, "message": "회원정보가 수정되었습니다." }
```

> `invalidatesTags: ['Auth', 'User']` — `getMe` + `getProfile` 동시 갱신.

---

### `useDeleteAccountMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/users` |

**Request Body**
```json
{ "password": "CurrentPass1!" }
```

**Response**: `204 No Content`

---

### `useGetAddressesQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/users/addresses` |

**Request**
- Parameters: 없음
- Body: 없음

**Response Body**
```json
{
  "status": 200,
  "data": {
    "totalCount": 2,
    "addresses": [
      {
        "addressId": 1,
        "postcode": "06234",
        "baseAddress": "서울특별시 강남구",
        "detailAddress": "101동 101호",
        "extraAddress": "(역삼동)",
        "addressType": "HOME",
        "default": true
      }
    ]
  }
}
```

> `transformResponse`: `res.data` 추출.  
> Cache Tag: `['Address']`

---

### `useCreateAddressMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/users/addresses` |

**Request Body**
```json
{
  "postcode": "06234",
  "baseAddress": "서울특별시 강남구",
  "detailAddress": "101동 101호",
  "extraAddress": "(역삼동)",
  "addressType": "HOME",
  "default": false
}
```

> `recipientName`, `phoneNumber`는 서버가 사용자 정보로 자동 채움.

**Response Body**
```json
{ "status": 201, "message": "배송지가 등록되었습니다." }
```

> `invalidatesTags: ['Address']`

---

### `useUpdateAddressMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `PUT` |
| **URL** | `/users/addresses/:addressId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `addressId` | number | Y | 배송지 ID |

**Request Body**: `useCreateAddressMutation`과 동일 구조.

> `invalidatesTags: ['Address']`

---

### `useDeleteAddressMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/users/addresses/:addressId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `addressId` | number | Y | 배송지 ID |

**Request Body**: 없음

**Response**: `204 No Content`

> `invalidatesTags: ['Address']`

---

## Wishlist (`src/api/wishlistApi.js`)

---

### `useGetWishlistQuery`

| 항목 | 값 |
|---|---|
| **메서드** | `GET` |
| **URL** | `/wishlist` |

**Request**
- Parameters: 없음
- Body: 없음

**컴포넌트 수신값** (`transformResponse` 후)
```json
[
  {
    "id": 1,
    "name": "사료명",
    "price": 27000,
    "img": "https://...",
    "currentOption": "1kg",
    "options": ["1kg", "2kg"]
  }
]
```

> Cache Tag: `[{ type: 'Wishlist', id: 'LIST' }]`

---

### `useAddWishlistItemMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `POST` |
| **URL** | `/wishlist` |

**Request Body**
```json
{ "productId": 1 }
```

**Response Body**
```json
{ "status": 201, "message": "관심상품에 추가되었습니다." }
```

> `invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }]`

---

### `useRemoveWishlistItemMutation`

| 항목 | 값 |
|---|---|
| **메서드** | `DELETE` |
| **URL** | `/wishlist/:productId` |

**Request Path Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `productId` | number | Y | 상품 ID |

**Request Body**: 없음

**Response**: `204 No Content`

> `invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }]`

# Review 도메인

## 개요

상품 리뷰 CRUD와 "도움돼요" 기능을 담당한다. 정렬·페이지 UI 상태는 `reviewSlice`, 실제 데이터는 `reviewApi` 캐시에서 관리한다.

---

## 비즈니스 정책

| 정책 | 값 | 코드 위치 |
|---|---|---|
| 텍스트 리뷰 적립금 | 미정 | `src/shared/utils/constants.js` → `REVIEW_POINT_TEXT` |
| 포토 리뷰 적립금 | 미정 | `src/shared/utils/constants.js` → `REVIEW_POINT_PHOTO` |
| 기본 페이지 크기 | 10개 | `src/shared/utils/constants.js` → `REVIEW_PAGE_SIZE` |

---

## 상태 구조

```js
review (reviewSlice) — UI 상태만
├── sortBy: 'createdAt'|'rating'|'helpful'
└── pagination: { page: 1, size: REVIEW_PAGE_SIZE }
```

---

## API 엔드포인트 (`reviewsApi`)

`src/features/reviews/reviewsApi.js` — `apiSlice.injectEndpoints()`로 정의.

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetProductReviewsQuery({ productId, params })` | GET | `/products/:productId/reviews` | 상품별 리뷰 목록 |
| `useGetMyReviewsQuery(params)` | GET | `/reviews/mine` | 내 리뷰 목록 |
| `useCreateReviewMutation` | POST | `/products/:productId/reviews` | 리뷰 작성 |
| `useUpdateReviewMutation` | PUT | `/reviews/:reviewId` | 리뷰 수정 |
| `useDeleteReviewMutation` | DELETE | `/reviews/:reviewId` | 리뷰 삭제 |
| `useMarkReviewHelpfulMutation` | POST | `/reviews/:reviewId/helpful` | 도움돼요 |

---

## 캐시 무효화 전략

| 액션 | invalidatesTags |
|---|---|
| `createReview` | `PRODUCT_<productId>`, `MINE` |
| `updateReview` | `<reviewId>`, `MINE` |
| `deleteReview` | `<reviewId>`, `MINE` |
| `markReviewHelpful` | `<reviewId>` |

---

## 정렬 연동 패턴

```js
const sortBy = useAppSelector(selectReviewSortBy)
const { page, size } = useAppSelector(selectReviewPagination)

const { data } = useGetProductReviewsQuery({
  productId,
  params: { sortBy, page, size },
})
```

`setReviewSort` 호출 시 `pagination.page`가 자동으로 1로 리셋된다.

---

## 리뷰 요약 UI

- 평점 분포 (최고·좋음·보통·별로·나쁨 %)
- 만족도 지표 (기호도·재구매의사·신선도)
- 필터: 리뷰 종류(동영상·사진·텍스트), 별점, 정렬

---

## 진입 경로

1. 상품 상세 (`/products/:id`) → '사용후기' 탭
2. 마이페이지 → `/my/reviews` (내 리뷰 목록)

---

## 액션 & 셀렉터

```js
// Actions
setReviewSort('createdAt'|'rating'|'helpful')
setReviewPage(page)

// Selectors
selectReviewSortBy(state)
selectReviewPagination(state)
```

---

## Mock 데이터

| 파일 | 내용 | 가변 여부 |
|---|---|---|
| `src/mocks/reviews.js` | 리뷰 목록 | 가변 (`let reviews = [...]`) |

---

## 리뷰 댓글 (Reply)

리뷰 아이템 펼침(isOpen) 시 댓글 목록과 입력창이 노출된다.

### 댓글 데이터 구조

```js
{
  id: number,
  name: string,       // 작성자 닉네임 (마스킹)
  date: string,       // 'YY. MM. DD.' 형식
  text: string,       // 댓글 내용
}
```

### 댓글 UX 흐름

1. 리뷰 클릭 → 펼침
2. 펼침 영역 하단에 기존 댓글 목록 표시
3. 텍스트 입력창 + "등록" 버튼으로 댓글 추가
4. 댓글은 해당 리뷰 state(`comments` 배열)에 추가됨 (현재 Mock)

---

## 현재 구현 vs. 목표

| 항목 | 현재 코드 | 목표 |
|---|---|---|
| 리뷰 통계 | 하드코딩 | `reviewsApi` 응답값 |
| API 구조 | 독립 `createApi` (`reviewApi.js`) | `apiSlice.injectEndpoints()` |
| 리뷰 작성 UI | 미구현 (주문목록 "구매후기" 버튼만 존재) | 구현 필요 |
| 내 리뷰 페이지 | 미구현 | `/my/reviews` 구현 필요 |
| 리뷰 댓글 | Mock(로컬 state) | `reviewCommentsApi` 연동 필요 |

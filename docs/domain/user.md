# User 도메인

기준일: 2026-04-15

## 개요

회원 프로필 조회·수정·탈퇴, 배송지 CRUD를 담당한다. 서버 데이터는 RTK Query `api` 캐시에만 존재한다.

> 로그인·회원가입·인증 흐름은 `docs/domain/auth.md` 참조.

---

## API 엔드포인트 (`src/api/userApi.js`)

`apiSlice.injectEndpoints()`로 정의.

### 프로필

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetProfileQuery()` | GET | `/users/profile` | 마이페이지 집계 데이터 (적립금·쿠폰 수·주문 건수 등) |
| `useUpdateProfileMutation` | PUT | `/users/profile` | 회원정보 수정 (비밀번호·이름·전화번호·마케팅 동의) |
| `useDeleteAccountMutation` | DELETE | `/users` | 회원 탈퇴 — `body: { password }` |

`updateProfile` 성공 시 `invalidatesTags: ['Auth', 'User']` → `getMe` + `getProfile` 캐시 모두 갱신.

### updateProfile 요청 바디

```js
{
  name: string,
  phoneNumber: string,
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  marketingConsent: {
    smsAllowed: boolean,
    emailAllowed: boolean,
  }
}
```

---

### 배송지

| 훅 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| `useGetAddressesQuery()` | GET | `/users/addresses` | 배송지 목록 — 응답: `{ totalCount, addresses: [...] }` |
| `useCreateAddressMutation` | POST | `/users/addresses` | 배송지 등록 |
| `useUpdateAddressMutation` | PUT | `/users/addresses/:addressId` | 배송지 수정 — `{ addressId, ...body }` |
| `useDeleteAddressMutation` | DELETE | `/users/addresses/:addressId` | 배송지 삭제 |

모든 배송지 Mutation은 `invalidatesTags: ['Address']`로 목록을 자동 재조회한다.

### createAddress / updateAddress 요청 바디

```js
{
  postcode: string,
  baseAddress: string,
  detailAddress: string,
  extraAddress: string,
  addressType: string,    // 'HOME' | 'WORK' | etc.
  default: boolean,
  // recipientName, phoneNumber 는 서버가 사용자 정보로 자동 채움
}
```

---

## 마이페이지 진입 경로

| 경로 | 페이지 | 설명 |
|---|---|---|
| `/mypage` | `UserProfilePage` | 마이페이지 대시보드 |
| `/profile/modify` | `ProfileModifyPage` | 회원정보 수정 |
| `/wishlist` | `WishListPage` | 관심상품 목록 |
| `/coupon` | `UserCouponPage` | 쿠폰 목록 |
| `/point` | `UserPointPage` | 적립금 내역 |
| `/address` | `UserAddressPage` | 배송지 관리 |
| `/order/list` | `OrderPage` | 주문 목록 |

모든 마이페이지 경로는 `ProtectedRoute`로 보호된다.

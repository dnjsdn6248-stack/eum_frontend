# Auth 도메인

## 개요

인증·인가 전체 흐름을 담당한다. 서버 통신은 `authApi`(RTK Query), 클라이언트 상태는 `authSlice`가 분리해서 관리한다.

> 구체적 구현 패턴은 `.claude/skills/auth-security/SKILL.md` 참조.

---

## 인증 구조

```
브라우저                      서버
POST /auth/login  ──────►   set-cookie: access_token  (HttpOnly)
◄── { user } ──────────                refresh_token  (HttpOnly)
                                        XSRF-TOKEN     (JS readable, HttpOnly: false)

Redux: { user } 만 저장. 토큰 state·localStorage 저장 절대 금지.
```

---

## 상태 구조 (목표)

```js
auth (authSlice)
├── user: { id, email, name, phone, role: 'USER'|'ADMIN', provider } | null
└── isInitialized: boolean   // AuthInitializer 완료 → 스피너 해제 신호
```

**액션 3개만:**

| 액션 | 호출 시점 |
|---|---|
| `setUser(user)` | 로그인·`/auth/me` 성공 시 |
| `setInitialized()` | `AuthInitializer`의 `getMe` finally 블록에서 (성공·실패 무관) |
| `logout()` | 로그아웃 or `withReauth` 갱신 실패 시 |

> **주의:** `authSlice`에서 `api/` 폴더 import 금지 — 순환 의존성 발생.

---

## API 엔드포인트 (`authApi`)

`src/api/authApi.js` — RTK Query `createApi`로 정의 (현재 아키텍처).

| 훅 | 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|---|
| `useGetMeQuery()` | GET | `/auth/me` | ✅ | 세션 복원 → `setUser` dispatch, finally에서 `setInitialized` |
| `useLoginMutation` | POST | `/auth/login` | ❌ | 로그인 → `setUser` dispatch |
| `useGetTermsQuery()` | GET | `/auth/terms` | ❌ | 약관 목록 조회 (회원가입 화면에서 사용) |
| `useSignupMutation` | POST | `/auth/signup` | ❌ | 회원가입 (약관 동의 포함) |
| `useLogoutMutation` | POST | `/auth/logout` | ✅ | 로그아웃 → `logout` dispatch |
| `useUpdateProfileMutation` | PUT | `/auth/profile` | ✅ | 프로필 수정 → `setUser` dispatch |
| `useChangePasswordMutation` | PUT | `/auth/password` | ✅ | 비밀번호 변경 |

---

## 약관(Terms) API

### GET /auth/terms

인증 불필요. 회원가입 화면 진입 시 호출하여 약관 목록을 렌더링.

**응답 구조**

```json
{
  "terms": [
    { "id": "service_terms",   "title": "서비스 이용약관",       "content": "...", "isRequired": true,  "version": "1.0" },
    { "id": "privacy_policy",  "title": "개인정보보호정책",       "content": "...", "isRequired": true,  "version": "1.0" },
    { "id": "marketing_sms",   "title": "SMS 마케팅 정보 수신",   "content": "...", "isRequired": false, "version": "1.0" },
    { "id": "marketing_email", "title": "이메일 마케팅 정보 수신", "content": "...", "isRequired": false, "version": "1.0" }
  ]
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | String | 약관 식별자 (`service_terms`, `privacy_policy`, `marketing_sms`, `marketing_email`) |
| `isRequired` | Boolean | `true` → 필수 동의, `false` → 선택 동의 |
| `content` | String | 약관 전문 (줄바꿈 포함) |
| `version` | String | 약관 버전 |

### POST /auth/signup

인증 불필요. `termsAgreed` 객체에 각 약관 ID를 키로 동의 여부(Boolean)를 포함.  
필수 약관(`service_terms`, `privacy_policy`)이 `false`이면 서버에서 400 반환.

**요청 바디**

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

**비밀번호 규칙:** 8~20자, 대/소문자 + 숫자 + 특수문자(`@$!%*?&`) 각 1개 이상.

**성공 응답:** `200 OK` → `{ "body": "회원가입 성공!" }`

**에러 응답:**
| 상태 | 내용 |
|---|---|
| 400 | 입력값 검증 실패 (`details` 필드에 필드별 메시지) |
| 400 | 중복 아이디 / 이메일 |
| 400 | 필수 약관 미동의 |
| 500 | 서버 오류 |

---

## withReauth 패턴

모든 `baseQuery`는 `withReauth`로 감싸야 한다 (**withReauth** 규칙).

```js
// 401 수신 시
POST /auth/refresh  →  성공: 원본 요청 재시도
                    →  실패: dispatch(logout()) 후 종료 (루프 방지)
```

CSRF 토큰은 `getCookie('XSRF-TOKEN')`으로 읽어 `X-XSRF-TOKEN` 헤더에 주입 (백엔드 연결 시).

---

## AuthInitializer 패턴

앱 최상단에서 새로고침 후 세션을 복원한다. FOUC 방지를 위해 `isInitialized`가 `false`인 동안 전체 화면 스피너 표시.

```jsx
// src/features/auth/AuthInitializer.jsx
export default function AuthInitializer({ children }) {
  useGetMeQuery()
  const { isInitialized } = useAuth()
  if (!isInitialized) return <Spinner fullscreen />
  return children
}
```

`getMe.onQueryStarted`의 **`finally`** 에서 `setInitialized()`를 반드시 호출해야 한다.  
누락 시 앱이 영원히 스피너 상태가 된다.

---

## ProtectedRoute 패턴

```jsx
// 비로그인 시 /login으로 이동, location.pathname을 state.from으로 전달
<Navigate to="/login" state={{ from: location.pathname }} replace />

// LoginPage에서 로그인 완료 후 복귀
const redirectTo = location.state?.from || '/'
```

---

## OAuth2 소셜 로그인

- 프론트는 `/oauth2/authorization/{provider}`로 리다이렉트만 수행
- `state` nonce: `generateOAuth2State()` 생성 → sessionStorage 임시 저장 (콜백에서 검증 후 즉시 삭제)
- Client ID · Secret 코드 포함 절대 금지 (**No OAuth Secret**)

> 상세 구현: `.claude/skills/auth-security/examples/oauth2-callback.md` 참조.

---

## 회원가입 UI 흐름

1. **이메일 인증 모달** — `POST /auth/email-verify`로 코드 발송 → 6자리 코드 확인
2. 인증 완료 후 폼에 이메일 자동 채움
3. 필드: `username`, `email`(인증값), `name`, `phoneNumber`, `password`
4. 가입 성공 후 로그인 페이지로 이동

---

## 현재 구현 vs. 목표

| 항목 | 현재 코드 | 목표 |
|---|---|---|
| 토큰 저장 | `localStorage` + Redux `accessToken` | HttpOnly 쿠키 (JS 접근 불가) |
| 인증 슬라이스 액션 | `setCredentials / clearCredentials / setToken` | `setUser / setInitialized / logout` |
| 초기화 | `AppInit`에서 `isAuthenticated` 조건부 `getMe` | `AuthInitializer`에서 항상 `getMe` (스피너 처리) |
| API 구조 | `authApi.js`에 독립 `createApi` | `apiSlice.injectEndpoints()` |
| 로그인 폼 | UI 완성, 훅 미연결 | `useLoginMutation` 연결 |
| 소셜 로그인 | UI만 존재 | OAuth2 리다이렉트 구현 필요 |

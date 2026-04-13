# UI 도메인

## 개요

전역 UI 상태(로딩 오버레이, 토스트, 모달, 모바일 메뉴, 검색창)를 `uiSlice` 하나에서 중앙 관리한다.

> 컴포넌트 클래스 목록·레이아웃 패턴은 `.claude/skills/styling/SKILL.md` 참조.

---

## 상태 구조

```js
ui (uiSlice)
├── globalLoading: boolean
├── toasts: Toast[]
│   └── Toast: { id, type: 'success'|'error'|'warning'|'info', message, duration? }
├── modals
│   ├── login: boolean
│   ├── addressSearch: boolean
│   ├── productQuickView: boolean
│   └── cartAlert: boolean
├── modalData: any | null
├── isMobileMenuOpen: boolean
└── isSearchOpen: boolean
```

---

## 토스트

```js
// 추가 — id 자동 생성, 기본 duration 3000ms
dispatch(addToast({ type: 'success', message: '장바구니에 담겼습니다.' }))
dispatch(addToast({ type: 'error', message: '오류가 발생했습니다.', duration: 5000 }))

// 제거
dispatch(removeToast(toastId))
dispatch(clearAllToasts())
```

`useToast` 훅(`src/hooks/useToast.js`)으로 간편 호출:

```js
const toast = useToast()
toast.success('저장되었습니다.')
toast.error('네트워크 오류')
```

daisyUI의 `toast toast-top toast-end` + `alert alert-*` 클래스로 렌더링.

---

## 모달

모달 이름은 `modals` 객체의 키와 정확히 일치해야 한다.  
새 모달 추가 시 `uiSlice`의 `modals` 초기값에 키를 추가해야 한다.

```js
dispatch(openModal({ name: 'cartAlert', data: { itemName: '오독오독 바삭' } }))
dispatch(closeModal('cartAlert'))
dispatch(closeAllModals())

const isOpen = useAppSelector(selectIsModalOpen('cartAlert'))
const data   = useAppSelector(selectModalData)
```

daisyUI `modal modal-box` 클래스 사용 권장.

---

## 전역 로딩 오버레이

RTK Query의 `isLoading`으로 충분한 경우가 많다. `globalLoading`은 복수 비동기 작업이 동시 진행될 때처럼 전역 차단이 필요한 케이스에만 사용.

```js
dispatch(setGlobalLoading(true))
dispatch(setGlobalLoading(false))
```

로딩 스피너 컴포넌트: `src/shared/components/Spinner.jsx` — daisyUI `loading loading-spinner` 사용.

---

## 내비게이션 상태

```js
dispatch(toggleMobileMenu())   // 모바일 메뉴 토글
dispatch(closeMobileMenu())
dispatch(toggleSearch())       // 검색창 토글
dispatch(closeSearch())

useAppSelector(selectIsMobileMenuOpen)
useAppSelector(selectIsSearchOpen)
```

---

## 상태별 UI 패턴 (daisyUI)

```jsx
// 로딩
if (isLoading) return <div className="loading loading-spinner loading-lg" />

// 에러
if (error) return (
  <div className="alert alert-error">
    <span>{error.data?.message || '오류가 발생했습니다'}</span>
  </div>
)

// 빈 상태
if (!data?.length) return (
  <div className="text-center py-20 text-base-content/50">
    <p>결과가 없습니다</p>
  </div>
)
```

---

## 전체 셀렉터

```js
selectGlobalLoading(state)
selectToasts(state)
selectModals(state)
selectModalData(state)
selectIsMobileMenuOpen(state)
selectIsSearchOpen(state)
selectIsModalOpen(name)(state)   // 특정 모달 열림 여부
```

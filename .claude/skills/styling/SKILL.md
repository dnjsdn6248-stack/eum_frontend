---
name: styling
description: "멍샵 Tailwind CSS v4 + daisyUI v5 UI 구현 표준. daisyUI 컴포넌트 우선 사용 원칙, 시맨틱 색상 시스템, 반응형 모바일 퍼스트 레이아웃, 상태별(로딩·에러·빈 상태) UI 패턴을 정의한다. TRIGGER when: UI 컴포넌트나 페이지 레이아웃을 새로 작성할 때, className이나 스타일을 추가·수정할 때, daisyUI 컴포넌트 클래스를 선택할 때, 반응형 레이아웃을 구현할 때. Do NOT use for: 비즈니스 로직·API 호출·상태 관리 등 UI와 무관한 작업."
user-invocable: false
---

# 스타일링 (Tailwind v4 + daisyUI v5)

이 프로젝트의 UI 구현 패턴과 daisyUI 컴포넌트 사용 방법을 정의한다.  
구체적인 컴포넌트 코드는 `examples/components.md` 참조.

---

## 설정

```css
/* src/index.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: false;
  base: false;
  styled: false;  /* daisyUI 컴포넌트 스타일 비활성화 — 커스텀 디자인 시스템 사용 */
  utils: false;
}

@theme {
  --color-primary: #3ea76e;
  --color-primary-dark: #318a57;
  --color-bg-light: #FCFBF9;
  --color-border-default: #D1D5DB;
}
```

> ⚠️ daisyUI는 거의 비활성화 상태. `text-primary` / `bg-primary`만 `@theme` 토큰으로 동작.  
> `text-base-content`, `bg-base-200`, `badge-success` 등 daisyUI 시맨틱 토큰은 **사용 불가**.

---

## 브랜드 컬러 시스템

이 프로젝트는 daisyUI 시맨틱 색상 대신 **커스텀 브랜드 컬러**를 직접 사용한다.

| 용도 | 값 | Tailwind |
|---|---|---|
| 주 브랜드 | `#3ea76e` | `bg-primary` / `text-primary` 또는 `bg-[#3ea76e]` |
| 브랜드 다크 | `#318a57` | `bg-[#318a57]` |
| 딥 그린 | `#1B4332` | `text-[#1B4332]` |
| 기본 텍스트 | `#111111` | `text-[#111]` (body 기본값) |
| 보조 텍스트 | `#555`, `#666`, `#999` | `text-[#555]` 등 |
| 배경 | `#FCFBF9` | `bg-[#FCFBF9]` |
| 카드 배경 | `#ffffff` | `bg-white` |
| 구분선 | `#eee`, `#f5f5f5` | `border-[#eee]` |

---

## index.css 커스텀 버튼 클래스

아래 클래스는 daisyUI가 아닌 `index.css`에 직접 정의된 커스텀 클래스다.

| 클래스 | 용도 |
|---|---|
| `btn-primary` | 초록 배경 + 흰 텍스트, `rounded-full` |
| `btn-outline` | 초록 테두리 + 초록 텍스트, `rounded-full` |
| `btn-ghost` | 회색 테두리 + 회색 텍스트, `rounded-full` |
| `hover-primary` | 기본 흰배경 → hover 시 초록, 탭 버튼용 |
| `btn-capsule` | 흰배경 테두리 → hover 시 초록 텍스트/테두리 |

---

## 공통 카드 스타일

```jsx
<div className="rounded-[32px] border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white">
```

---

## 버튼 패턴

```jsx
// 메인 버튼 (커스텀 클래스)
<button className="btn-primary px-6 py-3 text-[15px]">구매하기</button>

// 아웃라인 버튼 (커스텀 클래스)
<button className="btn-outline px-6 py-3">취소</button>

// 탭 버튼 (hover-primary)
<button className={`hover-primary px-4 py-2 text-[13px] ${active ? 'active' : ''}`}>전체</button>

// Tailwind only 버튼
<button className="bg-[#3ea76e] text-white rounded-full font-black border-none px-6 py-3 hover:bg-[#318a57] transition-colors">
```

---

## 폰트 & 자간

```jsx
// 헤딩: tracking-[-0.05em] 또는 tracking-tighter
<h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">

// 본문: tracking-tight 또는 기본 (body에서 letter-spacing: -0.07em 전역 적용)
<p className="text-[14px] text-[#555]">
```

---

## Layout 구조

```jsx
/* Layout.jsx — 이미 max-w-[1200px] px-6 적용됨 */
<div className="w-full min-h-screen bg-white flex flex-col items-center">
  <Header />
  <main className="w-full max-w-[1200px] px-6 md:px-8">
    <Outlet />
  </main>
  <Footer />
</div>
```

> ⚠️ Layout이 `max-w-[1200px] px-6` 잡아줌 — 각 페이지에서 중복 래퍼 금지

### 페이지 타이틀

```jsx
<div className="max-w-[1200px] mx-auto text-center py-24">
  <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">페이지명</h1>
</div>
```

### 그리드 (상품 카드)

```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

---

## 반응형 원칙

모바일 퍼스트. 기본 클래스 → `sm:` → `lg:` 순으로 확장.

```jsx
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
className="hidden lg:flex"
className="flex flex-col sm:flex-row gap-3"
```

---

## 상태별 UI 패턴

```jsx
// 로딩
if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>

// 에러
if (error) return (
  <div className="text-center py-20 text-[#999]">
    <p className="text-[15px]">오류가 발생했습니다</p>
  </div>
)

// 빈 상태
if (!data?.length) return (
  <div className="text-center py-20 text-[#999]">
    <p className="text-[40px] mb-4">🔍</p>
    <p className="text-[15px]">결과가 없습니다</p>
  </div>
)
```

---

## 피해야 할 패턴

```jsx
// ❌ 인라인 style 속성 (동적 % / transform 제외)
<div style={{ color: '#ff0000', marginTop: '16px' }}>

// ❌ daisyUI 시맨틱 토큰 (비활성화 상태 — 무효)
<p className="text-base-content/50">   // ← 정의되지 않아 투명처리됨
<div className="bg-base-200">          // ← 정의되지 않아 무색

// ✅ 브랜드 컬러 직접 사용
<p className="text-[#555]">
<div className="bg-[#f5f5f5]">

// ✅ primary 토큰은 사용 가능 (@theme에 정의됨)
<p className="text-primary">
<button className="bg-primary text-white">
```

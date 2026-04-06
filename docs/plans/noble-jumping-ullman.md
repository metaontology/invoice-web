# Phase 5: 관리자 기능 구축 계획

## Context

invoice-web MVP(견적서 조회 + PDF 다운로드)가 완성된 상태에서, 관리자가 모든 견적서를 한눈에 관리하고 클라이언트에게 링크를 전달할 수 있는 관리자 대시보드 기능을 구축합니다. Phase 5는 Task 013~015 세 단계로 구성되며, 이후 Phase 6(링크 관리), Phase 7(다크모드)의 기반이 됩니다.

---

## 구현 계획

### Task 013: 관리자 레이아웃 및 인증 시스템

**목적**: `/admin/*` 경로를 보호하고, 환경변수 패스워드 기반의 간단한 인증 시스템을 구축합니다.

**수정/생성 파일**:
- `middleware.ts` — 기존 rate limiting 유지 + `/admin/:path*` 인증 체크 추가
- `src/lib/env.ts` — `NOTION_INVOICES_DATABASE_ID`, `ADMIN_PASSWORD` 검증 추가
- `src/lib/auth/session.ts` — 세션 생성/검증/삭제 (HttpOnly 쿠키 + 서버 메모리 Set)
- `src/lib/auth/actions.ts` — `login()`, `logout()` Server Actions
- `src/app/admin/layout.tsx` — 관리자 전용 레이아웃
- `src/app/admin/login/page.tsx` — 로그인 폼 페이지
- `src/components/admin/admin-nav.tsx` — 관리자 네비게이션 바
- `.env.local.example` — `ADMIN_PASSWORD` 추가

**핵심 설계**:
- 세션: `crypto.randomUUID()` → HttpOnly 쿠키, 서버 메모리 `Set<string>`으로 검증
- middleware는 Edge Runtime이므로 `request.cookies.get()` 사용 (cookies() API 불가)
- `/admin/login` 경로는 인증 검사 제외

### Task 014: 견적서 목록 페이지

**목적**: Notion Invoices DB 전체 목록을 테이블로 표시, 페이지네이션(10개씩) + 정렬 제공.

**수정/생성 파일**:
- `src/lib/services/invoice-list.service.ts` — Notion 목록 조회 (기존 `dataSources.query` v5 패턴 재사용)
- `src/app/admin/invoices/page.tsx` — Server Component 페이지
- `src/components/admin/invoice-table.tsx` — Client Component (정렬, URL searchParams)
- `src/components/admin/status-badge.tsx` — 상태 배지 (shadcn Badge 재사용)

**재사용 코드**:
- `getNotionClient()` (`src/lib/notion.ts`)
- `parseInvoicePage(page, [])` (`src/lib/utils/notion-parser.ts`) — items 빈 배열로 전달
- `Invoice`, `InvoiceStatus` 타입 (`src/types/invoice.ts`)
- `unstable_cache` + `CACHE_TTL` 패턴 (`src/lib/config.ts`)
- shadcn `Table`, `Badge`, `Button` 컴포넌트

### Task 015: 검색 및 필터링

**목적**: 클라이언트명/번호 검색, 상태 필터, 날짜 범위 필터를 URL searchParams 기반으로 구현.

**수정/생성 파일**:
- `src/lib/utils/search-filter.ts` — Notion compound filter 빌더
- `src/components/admin/search-bar.tsx` — Client Component (`useDebounceCallback` 300ms)
- `src/components/admin/filter-panel.tsx` — Client Component (상태 Select + 날짜 Input)
- `src/lib/services/invoice-list.service.ts` — `q`, `status`, `from`, `to` 파라미터 추가
- `src/app/admin/invoices/page.tsx` — SearchBar, FilterPanel 통합
- `src/components/admin/invoice-table.tsx` — 검색어 하이라이팅 추가

**핵심 설계**:
- Notion or 필터: `{ or: [{ rich_text contains }, { title contains }] }`
- URL searchParams 업데이트: `URLSearchParams` 복사 후 set/delete (기존 파라미터 보존)
- 하이라이팅: `highlightText(text, query)` → `<span className="bg-yellow-200">` 적용

---

## 의존성 그래프

```
Task 013 (인증/레이아웃)
    ↓
Task 014 (목록 페이지)
    ↓
Task 015 (검색/필터링)
```

---

## 검증 방법

1. **Task 013**: `/admin` 접근 → `/admin/login` 리다이렉트 확인, 로그인/로그아웃 플로우 Playwright 테스트
2. **Task 014**: `/admin/invoices` 에서 실제 Notion 데이터 테이블 표시, 정렬/페이지네이션 동작 확인
3. **Task 015**: 검색어 입력 후 필터링 결과 확인, URL 새로고침 후 필터 상태 유지 확인

---

## 환경변수 추가 필요

```env
NOTION_INVOICES_DATABASE_ID=   # 견적서 목록 DB ID
ADMIN_PASSWORD=                 # 관리자 패스워드
```

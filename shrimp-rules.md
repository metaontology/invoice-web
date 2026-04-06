# Development Guidelines — invoice-web

## Project Overview

- **목적**: Notion DB → 견적서 웹 조회 → PDF 다운로드 (공개 접근, 인증 없음)
- **핵심 URL**: `/invoice/[notionPageId]` — Notion 페이지 ID로 견적서 접근
- **데이터 흐름**: Notion API (Server) → Server Component 렌더링 → Client PDF 다운로드
- **현재 상태**: 프로젝트 스켈레톤 완성, Notion API 연동 및 PDF 생성 미구현

---

## Tech Stack (Exact Versions)

| 패키지 | 버전 | 비고 |
|--------|------|------|
| next | 16.2.1 | App Router |
| react | 19.2.4 | |
| typescript | ^5 | strict mode |
| tailwindcss | ^4 | |
| radix-ui | ^1.4.3 | **모노리식 단일 패키지** |
| next-themes | ^0.4.6 | |
| sonner | ^2.0.7 | |
| react-hook-form | ^7.72.0 | |
| @hookform/resolvers | ^5.2.2 | |
| zod | ^4.3.6 | **v4 — v3과 API 일부 다름** |
| usehooks-ts | ^3.1.1 | |
| lucide-react | ^1.7.0 | |
| shadcn (CLI) | ^4.1.1 | |
| @notionhq/client | **미설치** | Task 007 전 `npm install @notionhq/client` 필요 |
| @react-pdf/renderer | **미설치** | Task 009 전 `npm install @react-pdf/renderer` 필요 |

---

## Project Architecture

### 라우트 구조

| 경로 | 파일 | 레이아웃 |
|------|------|---------|
| `/` | `app/(public)/page.tsx` | PublicLayout (헤더+푸터) |
| `/invoice/[notionPageId]` | `app/invoice/[notionPageId]/page.tsx` | 독립 레이아웃 |
| `/_not-found` | `app/not-found.tsx` | — |
| `/api/generate-pdf` | `app/api/generate-pdf/route.ts` | **미구현 — 생성 필요** |

### 핵심 디렉토리

```
app/
  layout.tsx              ← RootLayout (Providers + Toaster 포함, 수정 주의)
  (public)/               ← PublicLayout 그룹 (헤더+푸터)
  invoice/[notionPageId]/ ← 견적서 조회 (독립 레이아웃, 현재 TODO 스켈레톤)
  api/generate-pdf/       ← PDF 생성 API Route (생성 필요)

components/
  ui/                     ← shadcn 프리미티브만 (shadcn add로만 추가)
  features/               ← 기능 컴포넌트 (theme-toggle 등)
  layouts/                ← 레이아웃 컴포넌트 (Server)
  navigation/             ← 헤더/푸터 (Server)
  page/                   ← page-header, empty-state
  providers/              ← Providers (ThemeProvider + TooltipProvider)
  pdf/                    ← PDF 템플릿 컴포넌트 (생성 필요)

lib/
  utils.ts                ← cn() 유틸리티 (clsx + tailwind-merge)
  notion.ts               ← Notion 클라이언트 (생성 필요)
  services/
    invoice.service.ts    ← 견적서 데이터 조회 서비스 (생성 필요)
  utils/
    notion-parser.ts      ← Notion API 응답 변환 (생성 필요)
  pdf/
    generator.ts          ← PDF 생성 로직 (생성 필요)
  constants/
    site.ts               ← siteConfig
    nav.ts                ← 네비게이션 상수

types/
  index.ts                ← NavItem 등 공통 타입 (기존)
  invoice.ts              ← Invoice, InvoiceItem 타입 (생성 필요)
  notion.ts               ← Notion API 응답 타입 (생성 필요)

hooks/                    ← @/hooks alias 정의됨, 디렉토리 없음 (필요 시 생성)
shrimp_data/              ← Shrimp Task Manager 데이터 (수정 금지)
docs/
  ROADMAP.md              ← 단일 로드맵 파일 (작업 완료 시 업데이트)
  plans/                  ← 계획 문서 (YYYY-MM-DD-HHMM-제목.md)
  dev/                    ← 기술 문서
  history/                ← 세션 기록 (YYYY-MM-DD-HHMM-작업명.md)
  raw/                    ← 참조용 원본 문서 (수정 금지)
```

---

## ⚠️ Critical: radix-ui 패키지 사용법

이 프로젝트는 `radix-ui` **모노리식 단일 패키지** 사용. `@radix-ui/react-*` 개별 패키지 **사용 금지**.

```typescript
// ✅ 올바른 import
import { Dialog, Slot } from "radix-ui"
import * as SlotPrimitive from "radix-ui"

// ❌ 잘못된 import (이 프로젝트에 설치 안 됨)
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Slot } from "@radix-ui/react-slot"
```

- `button.tsx`의 Slot: `Slot.Root` from `radix-ui` 패턴 사용
- 기존 `components/ui/` 파일들의 import 패턴을 반드시 참조 후 동일하게 작성

---

## ⚠️ Critical: Zod v4 사용법

이 프로젝트는 `zod: ^4.3.6` (v4) 사용. LLM 훈련 데이터의 v3 패턴과 일부 다름.

```typescript
// zod v4 주요 변경사항
// - z.string().email() 등 기본 API는 동일
// - error.issues 대신 error.errors 사용 가능
// - z.object().strict() 동작 변경

// 의심스러울 때는 context7 MCP로 Zod v4 문서 확인
```

- Zod v4 API 사용 전 context7 MCP (`mcp__context7__query-docs`)로 문서 확인 권장

---

## Code Standards

### Import 규칙

- `@/` 경로 별칭 **필수** — `../../` 상대 경로 **절대 금지**
- 올바른 예: `import { cn } from "@/lib/utils"`
- 잘못된 예: `import { cn } from "../../lib/utils"`

### 컴포넌트 작성

- **named export** 사용 (`export default` 금지)
- 인터페이스를 컴포넌트 위에 먼저 정의
- `className` prop은 항상 마지막에 `cn()` 으로 병합

```typescript
interface ComponentProps {
  title: string
  className?: string
}

export function ComponentName({ title, className }: ComponentProps) {
  return <div className={cn("base", className)}>{title}</div>
}
```

### 주석 언어

- 모든 주석은 **한국어** 작성
- 변수명·함수명은 **영문** (camelCase)

---

## Server vs Client Component Rules

### Server Component (기본값)

- `app/**/layout.tsx`, `app/**/page.tsx`
- `components/layouts/*.tsx`
- `components/navigation/public-header.tsx`, `public-footer.tsx`
- Notion API 호출은 **반드시 Server Component** 또는 Server Action에서

### Client Component (`"use client"` 필수)

- `useState`, `useEffect`, `useTheme` 등 훅 사용 시
- 이벤트 핸들러(`onClick`) 직접 처리 시
- PDF 다운로드 트리거 버튼 — Client Component로 분리 필요
- `components/features/theme-toggle.tsx` — `useTheme` + `useIsClient` 패턴 참조

### 금지

- Server Component에서 `onClick` 등 함수 props를 Child로 전달 **금지**
- Notion API 키를 Client Component에서 직접 호출 **금지**

---

## 알림(Toast) 사용법

`sonner`의 `Toaster`는 `app/layout.tsx`에 이미 포함됨.

```typescript
// Client Component에서 토스트 사용
import { toast } from "sonner"

toast.success("PDF 다운로드 완료")
toast.error("오류가 발생했습니다")
```

---

## Notion API Integration

### 환경 변수 (서버 사이드 전용, `NEXT_PUBLIC_` 없음)

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_INVOICES_DATABASE_ID=xxxxxxxxxxxxx
NOTION_ITEMS_DATABASE_ID=xxxxxxxxxxxxx
```

- `.env.local.example` 파일에 키 목록 있음
- 새 환경 변수 추가 시 `.env.local.example`도 동시 업데이트

### Notion 클라이언트 초기화 패턴

```typescript
// lib/notion.ts — 싱글턴 패턴
import { Client } from "@notionhq/client"

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})
```

### 데이터 조회 패턴

```typescript
// lib/services/invoice.service.ts
import { notion } from "@/lib/notion"

// 견적서 기본 정보 조회
const page = await notion.pages.retrieve({ page_id: notionPageId })

// 연결된 항목 조회 (역방향 Relation)
const items = await notion.databases.query({
  database_id: process.env.NOTION_ITEMS_DATABASE_ID!,
  filter: {
    property: "invoice",
    relation: { contains: notionPageId },
  },
})
```

### Notion 데이터 모델

**Invoices DB**: `invoice_code`(Title), `client_name`(Text), `issued_at`(Date), `expires_at`(Date), `status`(Select: pending|rejected|approved), `total_amount`(Number), `item`(Relation→Items)

**Items DB**: `item_code`(Title), `item_name`(Text), `quantity`(Number), `unit_price`(Number), `amount`(Formula: 단가×수량), `invoice`(Relation→Invoices)

---

## PDF Generation

### 기술 스택

- `@react-pdf/renderer` — **미설치, Task 009 전에 `npm install @react-pdf/renderer` 실행**

### 파일 위치

- PDF 템플릿: `components/pdf/invoice-template.tsx`
- PDF 생성 유틸: `lib/pdf/generator.ts`
- PDF API Route: `app/api/generate-pdf/route.ts`

### PDF API Route 패턴

```typescript
// app/api/generate-pdf/route.ts
import { renderToStream } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/pdf/invoice-template"
import { getInvoice } from "@/lib/services/invoice.service"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get("id")!
  const invoiceData = await getInvoice(pageId)
  const stream = await renderToStream(<InvoicePDF data={invoiceData} />)
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${pageId}.pdf"`,
    },
  })
}
```

### PDF 컴포넌트 규칙

- `@react-pdf/renderer`의 `Document`, `Page`, `View`, `Text`, `StyleSheet` 사용
- PDF 컴포넌트 내부에서 HTML 태그(`div`, `span`) **사용 금지**
- 한글 폰트: `public/fonts/` 에 배치 후 `Font.register()` 로 등록

---

## Next.js App Router Specific Patterns

### 비동기 params (Next.js 16)

```typescript
// params는 반드시 Promise로 await 처리
interface PageProps {
  params: Promise<{ notionPageId: string }>
}

export default async function Page({ params }: PageProps) {
  const { notionPageId } = await params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { notionPageId } = await params
  return { title: `견적서 ${notionPageId}` }
}
```

### notFound() / 에러 처리

```typescript
import { notFound } from "next/navigation"

if (!invoice) notFound()  // → app/not-found.tsx 렌더링
// Notion API 오류 → throw → app/error.tsx 에러 경계
```

### 새 라우트 추가

| 레이아웃 | 파일 경로 |
|---------|---------|
| PublicLayout (헤더+푸터) | `app/(public)/새경로/page.tsx` |
| 독립 레이아웃 | `app/새경로/page.tsx` + `app/새경로/layout.tsx` |

**주의**: `app/(public)/page.tsx`와 `app/page.tsx` 동시 존재 시 빌드 오류

---

## shadcn/ui Usage

### 컴포넌트 추가

```bash
npx shadcn add <component-name>
```

- `components/ui/` 생성 파일은 직접 수정 가능
- **예외**: `form.tsx`는 `npx shadcn add form` 지원 안 됨 → 수동 작성
- 기존 `components/ui/` 파일 import 패턴 보고 `radix-ui` 사용법 확인

### 주의사항

- `globals.css`의 CSS 변수 (`--sidebar`, `--sidebar-foreground` 등) 중복 정의 금지
- theme-toggle SSR 하이드레이션: `useIsClient()` from `usehooks-ts` 패턴 참조

---

## Key File Interaction Standards

### 새 기능 파일 생성 시 동시 수정 규칙

| 작업 | 동시 수정 필요 파일 |
|------|------------------|
| 새 타입 추가 | `types/` 해당 파일 |
| Notion 서비스 수정 | `lib/notion.ts` + `lib/services/invoice.service.ts` + `lib/utils/notion-parser.ts` |
| 환경 변수 추가 | `.env.local.example` + `.claude/rules/project.md` |
| Task 완료 | `docs/ROADMAP.md` (완료 Task에 ✅ 표시, 진행 상황 업데이트) |

### 환경 변수 추가 시

1. `.env.local.example` 에 키만 추가 (값 없이)
2. `.claude/rules/project.md` 환경 변수 섹션에 명시

### 문서 작성 위치

| 문서 종류 | 위치 |
|---------|------|
| 계획 문서 | `docs/plans/YYYY-MM-DD-HHMM-제목.md` |
| 기술 문서 | `docs/dev/제목.md` |
| 세션 기록 | `docs/history/YYYY-MM-DD-HHMM-작업명.md` |
| 로드맵 | `docs/ROADMAP.md` (단일 파일) |

- `docs/` 루트에 직접 `.md` 파일 생성 **금지**
- 프로젝트 루트에 임의 `.md` 파일 생성 **금지** (README.md, ROADMAP.md 등 관용 파일 제외)

---

## Workflow Standards

### Task 구현 순서

1. `docs/ROADMAP.md` 에서 현재 Task 확인
2. 관련 파일 읽기 (기존 패턴 파악)
3. 새 패키지 필요 시 `npm install` 먼저 실행
4. 구현 → Playwright MCP로 E2E 테스트 (API/비즈니스 로직 필수)
5. `docs/ROADMAP.md` 해당 Task에 ✅ 표시

### 패키지 설치 전 체크

- 새 패키지 추가 전 `package.json` 확인
- `radix-ui` 관련: 이미 `radix-ui` 모노리식 패키지 설치됨 → `@radix-ui/react-*` 추가 설치 금지

---

## AI Decision-Making Standards

### 파일 위치 결정 트리

```
새 기능 코드?
├── UI 컴포넌트 → components/features/ 또는 components/page/
├── 데이터 서비스 → lib/services/
├── 변환/파싱 유틸 → lib/utils/
├── 타입 → types/
├── 커스텀 훅 → hooks/
├── API Route → app/api/[엔드포인트]/route.ts
└── PDF 관련 → components/pdf/ 또는 lib/pdf/
```

### 에러 처리 판단

- 견적서 미존재 → `notFound()` (404)
- Notion API 오류 → throw (error.tsx 처리)
- 잘못된 params → `notFound()` (404)

### 라이브러리 API 불확실 시

- `radix-ui` v1: 기존 `components/ui/` 파일 import 패턴 참조
- `zod` v4: context7 MCP로 Zod v4 문서 확인
- `next` 16: `node_modules/next/dist/docs/` 또는 context7 MCP 확인

---

## Prohibited Actions

- ❌ `../../` 상대 경로 import 사용
- ❌ `NEXT_PUBLIC_` 없이 Client Component에서 `process.env` 사용
- ❌ Server Component에서 `onClick` 등 함수 props 전달
- ❌ `@radix-ui/react-*` 개별 패키지 설치 (`radix-ui` 모노리식 사용)
- ❌ `components/ui/` 파일 직접 새로 생성 (`npx shadcn add` 사용)
- ❌ `app/(public)/page.tsx`와 `app/page.tsx` 동시 존재
- ❌ `docs/` 루트 또는 프로젝트 루트에 임의 `.md` 파일 생성
- ❌ PDF 컴포넌트 내부에서 HTML 태그 사용
- ❌ Notion API 키를 Client Component에서 직접 호출
- ❌ `useDebouncedCallback` 사용 (존재하지 않음 — `useDebounceCallback` 사용)
- ❌ `export default` 컴포넌트 (named export 사용)
- ❌ `shrimp_data/`, `docs/raw/` 디렉토리 파일 수정

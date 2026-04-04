# 코딩 컨벤션 및 패턴

## Server vs Client 컴포넌트

### 기본 원칙
- **Server Component (기본)**: layout, page, 정적 UI, 데이터 페칭
- **Client Component (`"use client"`)**: 훅 사용, 이벤트 핸들러, 브라우저 API, 상태 관리

### 파일별 분류

| 파일 | Server/Client |
|------|--------------|
| `app/**/layout.tsx` | Server |
| `app/**/page.tsx` | Server (기본) |
| `components/layouts/*.tsx` | Server |
| `components/navigation/public-header.tsx` | Server |
| `components/navigation/app-sidebar.tsx` | Server |
| `components/navigation/sidebar-nav.tsx` | Client (usePathname) |
| `components/navigation/mobile-nav.tsx` | Client (useState) |
| `components/navigation/app-header.tsx` | Client (사이드바 토글) |
| `components/features/theme-toggle.tsx` | Client (useTheme) |
| `components/features/user-menu.tsx` | Client (Dropdown) |
| `components/features/search-bar.tsx` | Client (useDebounceCallback) |
| `components/auth/*.tsx` | Client (폼 상태) |

---

## Import 패턴

항상 `@/` 경로 별칭 사용. 상대 경로(`../../`) 금지.

```typescript
// 유틸리티
import { cn } from "@/lib/utils"

// 상수
import { siteConfig } from "@/lib/constants/site"
import { mainNavItems } from "@/lib/constants/nav"

// 타입
import type { NavItem } from "@/types"

// 컴포넌트
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page/page-header"
```

---

## 컴포넌트 작성 패턴

```typescript
// 인터페이스 먼저 정의
interface ComponentProps {
  title: string
  description?: string
  className?: string
}

// named export 사용 (default export 지양)
export function ComponentName({ title, description, className }: ComponentProps) {
  return (
    <div className={cn("base-class", className)}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  )
}
```

---

## 스타일링 패턴

`cn()` 유틸리티로 조건부 클래스 처리:

```typescript
className={cn(
  "base-class other-base",
  isActive && "active-class",
  variant === "primary" && "primary-class",
  className  // 외부 className 항상 마지막
)}
```

---

## 폼 패턴

react-hook-form + zod 조합:

```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
})

type FormValues = z.infer<typeof schema>

export function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: FormValues) {
    // 처리 로직
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* isSubmitting으로 버튼 로딩 상태 관리 */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "처리 중..." : "제출"}
        </Button>
      </form>
    </Form>
  )
}
```

---

## ⚠️ 중요 Gotcha (반드시 숙지)

1. **usehooks-ts debounce 훅 이름**
   - `useDebounceCallback` 사용 (✅)
   - `useDebouncedCallback` 사용 금지 (❌ — 존재하지 않음)

2. **라우트 충돌**
   - `app/(public)/page.tsx`와 `app/page.tsx` 동시 존재 시 빌드 오류
   - `app/page.tsx`를 삭제하거나 둘 중 하나만 유지

3. **Server Component에서 함수 props 전달 불가**
   - Server Component는 직렬화 불가 함수를 props로 받을 수 없음
   - `onClick` 등 이벤트 핸들러가 필요하면 Client Component로 전환
   - `EmptyState` 같은 컴포넌트는 `action`을 `href | onClick` union으로 처리

4. **form.tsx는 shadcn add 미지원**
   - `npx shadcn add form` 불가
   - react-hook-form 기반으로 직접 수동 작성 필요

5. **button.tsx Slot 사용 방법 (radix-nova 패턴)**
   - `Slot.Root` from `radix-ui` 사용
   - `@radix-ui/react-slot`의 `Slot` 직접 사용 금지

6. **sidebar CSS 변수**
   - `--sidebar`, `--sidebar-foreground` 등은 `globals.css`에 이미 정의됨
   - 중복 정의 금지

7. **theme-toggle SSR 하이드레이션**
   - `useIsClient()` 훅으로 클라이언트 마운트 후 렌더링
   - 서버/클라이언트 불일치 방지

---

## 신규 라우트 추가 방법

| 원하는 레이아웃 | 파일 경로 |
|---------------|---------|
| AppLayout (사이드바) | `app/(app)/새경로/page.tsx` |
| AuthLayout (중앙 카드) | `app/(auth)/새경로/page.tsx` |
| PublicLayout (헤더+푸터) | `app/(public)/새경로/page.tsx` |
| 독립 레이아웃 | `app/새경로/page.tsx` + `app/새경로/layout.tsx` |

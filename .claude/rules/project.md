# 프로젝트 정보

## 기술 스택

| 항목 | 버전 / 내용 |
|------|------------|
| Next.js | 16.2.1 (App Router) |
| React | 19 |
| TypeScript | 5 (strict 모드) |
| Tailwind CSS | 4 |
| UI 라이브러리 | shadcn/ui (radix-nova 테마) |
| 패키지 매니저 | npm |

## 핵심 의존성

```json
{
  "next-themes": "테마(다크/라이트) 관리",
  "sonner": "토스트 알림",
  "react-hook-form": "폼 상태 관리",
  "zod": "스키마 검증",
  "@hookform/resolvers": "react-hook-form + zod 연결",
  "usehooks-ts": "유틸리티 훅 모음",
  "lucide-react": "아이콘"
}
```

## 디렉토리 구조

```
app/
  layout.tsx                    # RootLayout + Providers
  not-found.tsx                 # 전역 404 페이지
  error.tsx                     # 전역 에러 페이지
  (public)/                     # PublicLayout 적용 (헤더 + 푸터)
    page.tsx                    # 홈 안내 페이지 (/)
  invoice/
    [notionPageId]/
      page.tsx                  # 견적서 조회 페이지 (/invoice/[id])

components/
  ui/                           # shadcn 프리미티브 (button, input, card 등)
  providers/                    # ThemeProvider, Providers (TooltipProvider 포함)
  layouts/
    public-layout.tsx           # 헤더 + 푸터 레이아웃
  navigation/
    public-header.tsx           # 헤더 (Server Component)
    public-footer.tsx           # 푸터 (Server Component)
  page/
    page-header.tsx             # 페이지 헤더 (브레드크럼 + 제목)
    empty-state.tsx             # 빈 상태/에러 표시 컴포넌트
  features/
    theme-toggle.tsx            # 다크/라이트 테마 토글
    loading-skeleton.tsx        # 로딩 스켈레톤
    loading-spinner.tsx         # 로딩 스피너

lib/
  utils.ts                      # cn() 유틸리티
  constants/
    site.ts                     # siteConfig (프로젝트명, 설명, URL)
    nav.ts                      # 네비게이션 상수
  validations/
    auth.ts                     # zod 스키마 (향후 필요 시 활용)

types/
  index.ts                      # 공통 타입 정의 (NavItem 등)
```

## Route 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 안내 페이지 (PublicLayout) |
| `/invoice/[notionPageId]` | 견적서 조회 페이지 (독립 레이아웃) |
| `/_not-found` | 404 에러 페이지 |

## 신규 라우트 추가 방법

| 원하는 레이아웃 | 파일 경로 |
|---------------|---------|
| PublicLayout (헤더+푸터) | `app/(public)/새경로/page.tsx` |
| 독립 레이아웃 | `app/새경로/page.tsx` + `app/새경로/layout.tsx` |

## 빌드 상태

- 총 3개 라우트 (TypeScript 오류 없음)
  - `/` (홈 안내)
  - `/invoice/[notionPageId]` (견적서 조회)
  - `/_not-found`

## 환경 변수

```env
NOTION_API_KEY=                     # Notion Integration Token
NOTION_INVOICES_DATABASE_ID=        # 견적서 데이터베이스 ID
NOTION_ITEMS_DATABASE_ID=           # 항목 데이터베이스 ID
```

## next.config.ts 주요 설정

```typescript
// TypeScript strict 모드
// App Router 사용
```

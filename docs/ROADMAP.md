# 노션 기반 견적서 관리 시스템 MVP 개발 로드맵

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템

## 개요

노션 기반 견적서 관리 시스템 MVP는 프리랜서와 소규모 기업을 위한 간단하고 효율적인 견적서 관리 솔루션으로 다음 기능을 제공합니다:

- **노션 데이터베이스 연동**: Notion API를 통한 실시간 견적서 데이터 조회
- **견적서 웹 조회**: 고유 URL을 통한 견적서 내용 확인
- **PDF 다운로드**: 견적서를 PDF 파일로 변환하여 저장 및 인쇄

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `docs/ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP 테스트 필수
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 초기 설정 및 환경 구성** ✅ - 완료
  - ✅ Next.js 16.2.1 프로젝트 기본 구조 검증
  - ✅ 환경 변수 설정 (.env.local)
  - ✅ TypeScript 및 ESLint 설정 확인
  - ✅ Notion API 연동을 위한 @notionhq/client 설치

- **Task 002: 라우팅 구조 및 페이지 골격 생성** ✅ - 완료
  - ✅ src/ 디렉토리 구조로 마이그레이션 (app, components, lib, types, hooks)
  - ✅ tsconfig.json 경로 별칭 `./src/*` 업데이트
  - ✅ src/app/invoice/[notionPageId]/loading.tsx 생성 (LoadingSkeleton 재사용)
  - ✅ src/app/invoice/[notionPageId]/error.tsx 생성 (에러 경계, Client Component)

- **Task 003: 타입 정의 및 데이터 모델 설계** ✅ - 완료
  - ✅ 견적서 데이터 타입 인터페이스 정의 (Invoice, InvoiceItem, CompanyInfo, InvoiceStatus, InvoiceError)
  - ✅ Notion API 응답 타입 정의 (NotionPropertyValue union, NotionPage, NotionDatabaseQueryResult)
  - ✅ PDF 생성 관련 타입 정의 (InvoicePDFProps, PDFGenerateRequest)
  - ✅ npx tsc --noEmit 오류 없음

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 004: 더미 데이터 및 포맷 유틸리티 구축** ✅ - 완료
  - ✅ src/lib/data/dummy.ts — DUMMY_INVOICE 상수 정의 (CSV 기반, 3개 항목 + company 정보)
  - ✅ src/lib/utils/format.ts — formatCurrency(Intl.NumberFormat KRW), formatDate(toLocaleDateString ko-KR)
  - ✅ npx tsc --noEmit 오류 없음

- **Task 005: 견적서 조회 페이지 UI 구현** ✅ - 완료
  - ✅ src/components/invoice/invoice-header.tsx (Server) — 견적서 코드/날짜/상태 Badge
  - ✅ src/components/invoice/invoice-client-section.tsx (Server) — 고객사명 Card
  - ✅ src/components/invoice/invoice-items-table.tsx (Server) — 항목 테이블 (번호/코드/품명/수량/단가/금액)
  - ✅ src/components/invoice/invoice-totals.tsx (Server) — 합계 금액 섹션
  - ✅ src/components/invoice/invoice-pdf-button.tsx (Client) — PDF 다운로드 버튼 (disabled)
  - ✅ src/app/invoice/[notionPageId]/page.tsx 업데이트 — DUMMY_INVOICE 기반 max-w-4xl 반응형 레이아웃

- **Task 006: 견적서 전용 로딩 스켈레톤 완성** ✅ - 완료
  - ✅ src/components/features/invoice-loading-skeleton.tsx — 견적서 레이아웃 전용 스켈레톤
  - ✅ src/app/invoice/[notionPageId]/loading.tsx — InvoiceLoadingSkeleton으로 교체

- **Task 007: 견적서 페이지 UI/UX 개선** ✅ - 완료
  - ✅ 컨테이너 폭 max-w-3xl로 통일 (page.tsx, public-header.tsx, invoice-loading-skeleton.tsx)
  - ✅ invoice-header.tsx — border+rounded-xl+p-6+shadow-sm+bg-card 카드 형태 래핑
  - ✅ invoice-client-section.tsx — Card shadow-sm 추가
  - ✅ invoice-items-table.tsx — TableHead/TableCell py-3, 행 hover:bg-muted/30 적용
  - ✅ invoice-totals.tsx — 합계 금액 text-2xl, px-6 강조
  - ✅ space-y-6 → space-y-8 섹션 간격 확대

### Phase 3: 핵심 기능 구현 ✅

- **Task 007: Notion API 통합 구현** ✅ - 완료
  - ✅ src/lib/notion.ts — Notion Client 싱글턴 (NOTION_API_KEY)
  - ✅ src/lib/utils/notion-parser.ts — parseInvoicePage / parseItemPage 구현
  - ✅ src/lib/services/invoice.service.ts — getInvoice(pageId), 404 → null, @notionhq/client v5 대응
  - ✅ NotionPropertyFormula 타입 분기 처리
  - ✅ npx tsc --noEmit 오류 없음

- **Task 008: 견적서 데이터 페칭 및 렌더링** ✅ - 완료
  - ✅ app/invoice/[notionPageId]/page.tsx — DUMMY_INVOICE → getInvoice 교체, notFound() 처리
  - ✅ components/invoice/invoice-pdf-button.tsx — notionPageId prop 추가, href에 ?id= 반영
  - ✅ app/api/invoice/pdf/route.ts — id 없음 400 / invoice 없음 404, 실제 데이터 PDF 생성
  - ✅ npx tsc --noEmit 오류 없음

- **Task 009: PDF 생성 및 다운로드 기능** ✅ - 완료
  - ✅ public/fonts/NotoSansKR-Regular.ttf 설치 (9.9MB, Google Fonts)
  - ✅ invoice-pdf.tsx Font.register 경로 검증 (path.join process.cwd())
  - ✅ api/invoice/pdf/route.ts 파일명 {invoice_code}-견적서.pdf + UTF-8 인코딩

- **Task 009-1: 핵심 기능 통합 테스트** ✅ - 완료
  - ✅ 견적서 정상 렌더링 E2E 테스트 통과
  - ✅ 잘못된 ID → 404 페이지 처리 확인
  - ✅ PDF API 200 + Content-Type: application/pdf 확인
  - ✅ 브라우저 콘솔 에러 0건
  - ✅ 버그 수정: .env.local 환경변수 오타, relation 속성명 대소문자(Invoice), validation_error 404 처리

### Phase 4: 고급 기능 및 최적화 ✅

- **Task 010: 성능 최적화 및 캐싱** ✅ - 완료
  - ✅ Next.js 캐싱 전략 구현
  - ✅ 이미지 최적화 설정
  - ✅ 폰트 최적화 (subset 생성)
  - ✅ Notion API 호출 최적화
  - ✅ React Suspense 경계 설정

- **Task 011: 보안 및 에러 처리 강화** ✅ - 완료
  - ✅ API 키 보안 검증
  - ✅ Rate limiting 구현
  - ✅ 상세 에러 로깅 시스템
  - ✅ 404/500 에러 처리 개선
  - ✅ CORS 정책 설정

- **Task 012: 테스트 및 배포 준비** ✅ - 완료
  - ✅ E2E 테스트 4개 시나리오 구현 및 통과 (Playwright MCP 사용)
  - ✅ vercel.json 생성 (PDF API maxDuration 60초)
  - ✅ .env.local.example 최신화
  - ✅ npx tsc --noEmit 오류 없음
  - ✅ npm run build 성공
  - ✅ validateEnv() lazy 초기화 적용 (빌드 타임 환경변수 오류 수정)
  - ✅ Tailwind v4 @source 디렉티브 추가 (프로덕션 CSS 미적용 수정)
  - ✅ Vercel 프로덕션 배포 완료

## 작업별 상세 구현 사항

### Task 001: 프로젝트 초기 설정 및 환경 구성

**예상 소요 시간**: 2-3시간

**구현 내용**:

- `.env.local` 파일 생성 및 환경 변수 설정
  ```env
  NOTION_API_KEY=secret_xxxxxxxxxxxxx
  NOTION_DATABASE_ID=xxxxxxxxxxxxx
  ```
- `package.json` 의존성 확인 및 업데이트
- TypeScript 설정 검증 (`tsconfig.json`)
- ESLint/Prettier 설정 확인
- Git hooks 설정 (husky, lint-staged)

**완료 기준**:

- 환경 변수가 올바르게 설정됨 (Notion API 키 및 데이터베이스 ID 포함)
- 모든 의존성이 설치되고 버전이 일치함 (@notionhq/client 추가 완료)
- 개발 서버가 정상 실행됨 (`npm run dev`)
- 린트 및 타입 체크 통과
- Shrimp Task Manager MCP 서버 통합 완료

### Task 002: 라우팅 구조 및 페이지 골격 생성

**예상 소요 시간**: 3-4시간

**구현 내용**:

- `/app/invoice/[notionPageId]/page.tsx` 생성
- `/app/invoice/[notionPageId]/loading.tsx` 생성
- `/app/invoice/[notionPageId]/error.tsx` 생성
- `/app/not-found.tsx` 커스텀 404 페이지
- 공통 레이아웃 설정 (`/app/invoice/layout.tsx`)

**완료 기준**:

- 동적 라우팅이 정상 작동함 (/invoice/[notionPageId] 구조 구현)
- 각 페이지 파일이 생성되고 기본 구조를 가짐 (page, loading, error 컴포넌트)
- 404 페이지가 올바르게 표시됨 (커스텀 not-found.tsx 구현)
- 메타데이터가 올바르게 설정됨 (generateMetadata 함수 구현)

### Task 003: 타입 정의 및 데이터 모델 설계

**예상 소요 시간**: 2-3시간

**구현 내용**:

- `/types/invoice.ts` - 견적서 관련 타입
- `/types/notion.ts` - Notion API 응답 타입
- `/types/pdf.ts` - PDF 생성 관련 타입
- `/lib/constants.ts` - 상수 정의
- 타입 안전성을 위한 유틸리티 타입 생성

**완료 기준**:

- 모든 데이터 모델이 타입으로 정의됨 (Invoice, InvoiceItem, CompanyInfo 등)
- Notion API 응답 타입이 완성됨 (NotionPageResponse, PropertyValue 타입)
- TypeScript 컴파일 에러가 없음
- 타입 자동완성이 정상 작동함
- 엄격한 타입 체크 (strict mode) 활성화됨

### Task 007: Notion API 통합 구현

**예상 소요 시간**: 4-5시간

**구현 내용**:

- `/lib/notion.ts` - Notion 클라이언트 초기화
- `/lib/services/invoice.service.ts` - 견적서 데이터 서비스
- `/lib/utils/notion-parser.ts` - Notion 데이터 파싱 유틸리티
- API 에러 핸들링 및 재시도 로직
- 데이터 변환 및 검증 로직

**완료 기준**:

- Notion API 연결이 성공함
- 견적서 데이터를 정상적으로 조회함
- 데이터가 올바른 형식으로 변환됨
- 에러 처리가 적절히 구현됨

### Task 009: PDF 생성 및 다운로드 기능

**예상 소요 시간**: 5-6시간

**구현 내용**:

- `/components/pdf/invoice-template.tsx` - PDF 템플릿
- `/app/api/generate-pdf/route.ts` - PDF 생성 API
- `/lib/pdf/generator.ts` - PDF 생성 로직
- 한글 폰트 설정 및 스타일링
- 다운로드 트리거 및 파일명 설정

**완료 기준**:

- PDF가 정상적으로 생성됨
- 한글이 올바르게 표시됨
- 레이아웃이 견적서 형식에 맞음
- 다운로드가 모든 브라우저에서 작동함

## 기술적 의존성 관계

```mermaid
graph TD
    A[Task 001: 환경 설정] --> B[Task 002: 라우팅 구조]
    A --> C[Task 003: 타입 정의]
    B --> D[Task 004: 컴포넌트 라이브러리]
    C --> D
    D --> E[Task 005: 견적서 UI]
    D --> F[Task 006: 에러 UI]
    C --> G[Task 007: Notion API]
    E --> H[Task 008: 데이터 렌더링]
    G --> H
    E --> I[Task 009: PDF 생성]
    H --> I
    H --> J[Task 010: 성능 최적화]
    I --> J
    J --> K[Task 011: 보안 강화]
    K --> L[Task 012: 테스트/배포]
```

## MVP 체크리스트

### 핵심 기능 구현 확인

- [x] **F001**: Notion API를 통한 견적서 데이터 조회
- [x] **F002**: 고유 URL로 특정 견적서 내용 표시
- [x] **F003**: 견적서를 PDF 파일로 변환 및 다운로드

### 필수 지원 기능 구현 확인

- [x] **F010**: 노션 데이터베이스 ID 기반 고유 URL 생성
- [x] **F011**: 존재하지 않는 견적서 접근 시 에러 처리
- [x] **F012**: 반응형 레이아웃 (모바일/태블릿/데스크톱)

### 품질 검증

- [x] 모든 페이지가 정상적으로 로드됨
- [x] Notion 데이터가 실시간으로 동기화됨
- [x] PDF 다운로드가 모든 환경에서 작동함
- [x] 에러 처리가 사용자 친화적임
- [x] 반응형 디자인이 모든 기기에서 작동함

### 테스트 검증

- [x] API 연동 및 비즈니스 로직에 Playwright MCP 테스트 수행되었는가?
- [x] 모든 사용자 플로우가 E2E 테스트되었는가?
- [x] 에러 핸들링 및 엣지 케이스가 테스트되었는가?

## 예상 개발 일정

**총 예상 기간**: 2-3주 (1인 개발 기준)

- **Week 1**: Phase 1 + Phase 2 (Task 001-006)
  - 프로젝트 설정 완료 (Task 001-003)
  - UI 구현 완료 (Task 004-006)
  - 더미 데이터로 전체 플로우 검증

- **Week 2**: Phase 3 (Task 007-009)
  - Notion API 통합 (Task 007)
  - 실제 데이터 연동 (Task 008)
  - PDF 생성 기능 구현 (Task 009)
  - 통합 테스트 및 검증 (Task 009-1)

- **Week 3**: Phase 4 (Task 010-012)
  - 성능 최적화
  - 테스트 및 버그 수정
  - 배포 준비 및 실제 배포

## 위험 요소 및 대응 방안

### 기술적 위험

1. **Notion API 제한**
   - Rate limit 초과 가능성
   - 대응: 캐싱 전략 구현, 요청 최적화

2. **PDF 한글 렌더링 문제**
   - 폰트 임베딩 이슈
   - 대응: 사전 테스트, 대체 라이브러리 준비

3. **대용량 견적서 처리**
   - 많은 항목 시 성능 저하
   - 대응: 페이지네이션, 가상 스크롤링

### 비즈니스 위험

1. **사용자 경험 저하**
   - 느린 로딩 속도
   - 대응: 스켈레톤 UI, 점진적 로딩

2. **보안 이슈**
   - API 키 노출
   - 대응: 서버 사이드 처리, 환경 변수 관리

## 성공 지표

- **기술적 지표**
  - 페이지 로드 시간 < 3초
  - PDF 생성 시간 < 5초
  - 에러율 < 1%

- **사용자 경험 지표**
  - 모바일 반응형 100% 지원
  - 크로스 브라우저 호환성 100%
  - 견적서 조회 성공률 > 99%

---

**📝 문서 버전**: v2.0
**📅 작성일**: 2025-10-05
**📅 최종 업데이트**: 2026-04-06 (Vercel 배포 완료)
**🎯 목표**: MVP 핵심 기능 구현을 통한 빠른 시장 검증
**📊 진행 상황**: Phase 4 완료 (12/12 Tasks 완료)

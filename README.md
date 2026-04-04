# 견적서 시스템

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템입니다.

## 프로젝트 개요

**목적**: 노션 데이터베이스에 입력된 견적서 정보를 고유 URL로 클라이언트에게 공유하고, 클라이언트가 웹에서 확인 및 PDF로 다운로드할 수 있는 환경 제공

**범위**: 공개 견적서 조회 전용 (관리자 대시보드 없음, 인증 없음)

**사용자**: 견적서를 발행하는 프리랜서/소규모 기업(노션에서 직접 관리), 견적서를 받는 클라이언트(웹 URL로 조회)

## 주요 페이지

1. **견적서 조회** (`/invoice/[notionPageId]`) - 고유 URL로 특정 견적서 내용 표시, PDF 다운로드
2. **404 에러** (`/not-found`) - 존재하지 않는 견적서 접근 시 안내 메시지 표시

## 핵심 기능

- **F001 노션 데이터베이스 연동**: Notion API를 통해 견적서 데이터 조회
- **F002 견적서 조회**: 고유 URL로 특정 견적서 내용 표시
- **F003 PDF 다운로드**: 견적서를 PDF 파일로 변환 및 다운로드
- **F011 견적서 유효성 검증**: 존재하지 않는 견적서 접근 시 에러 처리
- **F012 반응형 레이아웃**: 모바일/태블릿/데스크톱 대응

## 기술 스택

- Framework: Next.js 16.2.1 (App Router)
- Runtime: React 19
- Language: TypeScript 5 (strict 모드)
- Styling: TailwindCSS v4
- UI Components: shadcn/ui (radix-nova 테마)
- Icons: Lucide React
- 외부 API: @notionhq/client (Notion API v1)
- PDF 생성: @react-pdf/renderer 또는 Puppeteer (예정)
- 배포: Vercel

## 시작하기

### 의존성 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local`을 생성하고 Notion API 정보를 입력합니다.

```bash
cp .env.local.example .env.local
```

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_INVOICES_DATABASE_ID=xxxxxxxxxxxxx
NOTION_ITEMS_DATABASE_ID=xxxxxxxxxxxxx
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

### 빌드

```bash
npm run build
npm start
```

## 개발 상태

- 기본 프로젝트 구조 설정 완료
- 견적서 조회 페이지 라우트 생성 완료 (`/invoice/[notionPageId]`)
- Notion API 연동 구현 예정
- PDF 다운로드 기능 구현 예정

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./.claude/CLAUDE.md) - 개발 지침

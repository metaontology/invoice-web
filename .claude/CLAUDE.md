# Claude Code 프로젝트 규칙

**invoice-web**은 노션을 데이터베이스로 활용하여 견적서를 관리하고 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 공개 견적서 조회 시스템입니다.

상세 요구사항은 @/docs/PRD.md 참조

이 프로젝트는 모듈형 규칙 시스템을 사용합니다.

## 📚 규칙 모듈

각 규칙은 `.claude/rules/` 디렉토리에 분리되어 있습니다:

### 🌐 커뮤니케이션
- [`language.md`](./rules/language.md) - 언어 및 커뮤니케이션 규칙

### 📂 파일 & 문서
- [`file-structure.md`](./rules/file-structure.md) - 파일 구조 규칙
- [`plans.md`](./rules/plans.md) - Plans 디렉토리 규칙
- [`dev-docs.md`](./rules/dev-docs.md) - Dev Docs 규칙
- [`memory.md`](./rules/memory.md) - Memory 디렉토리 규칙
- [`history.md`](./rules/history.md) - History 디렉토리 규칙
- [`roadmap.md`](./rules/roadmap.md) - Roadmap 파일 경로 및 포맷 규칙

### 💻 코드 작성
- [`project.md`](./rules/project.md) - 기술 스택, 디렉토리 구조, 의존성
- [`coding-standards.md`](./rules/coding-standards.md) - 코딩 컨벤션, 패턴, 주의사항
- [`git-commit.md`](./rules/git-commit.md) - Conventional Commits 커밋 메시지 규칙

### 🛠️ 도구 & 환경
- [`playwright.md`](./rules/playwright.md) - Playwright MCP 브라우저 제어 패턴 (CDP, 활성 탭 열기)

## ⚠️ 중요 원칙

1. 모든 문서는 한국어로 작성
2. 파일 위치 규칙 엄수
3. Server/Client 컴포넌트 구분 준수
4. `@/` 경로 별칭 사용 (상대 경로 금지)
5. 신규 파일 작성 전 `project.md`와 `coding-standards.md` 참조

## 🚫 금지 사항

- ❌ `./docs/` 루트에 직접 문서 작성
- ❌ 프로젝트 루트에 `.md` 파일 작성 (대문자 관용 메타 파일 제외 — `README.md`, `ROADMAP.md` 등)
- ❌ Server Component에서 함수 props 전달
- ❌ 상대 경로 import (`../../`) 사용

---
*마지막 업데이트: 2026-03-24*

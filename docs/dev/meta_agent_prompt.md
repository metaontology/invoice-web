# meta_agent_prompt.md

`agent_prompt.md` 파일 자체를 생성하는 메타 프롬프트.
아래 프롬프트를 Claude Code에 붙여넣으면 `docs/dev/agent_prompt.md` 를 재현합니다.

---

## 프롬프트

```
다음 절차대로 docs/dev/agent_prompt.md 파일을 작성해줘.

## Step 1: 버전 및 페이지 목록 수집

### 1-1. Next.js 현재 버전 감지
훈련 데이터의 버전을 추정하지 말고, 반드시 아래 중 하나로 실제 버전을 확인해:
- package.json의 "next" 버전 읽기
- context7로 /vercel/next.js resolve 후 최신 버전 확인

감지한 버전을 이후 모든 단계에서 사용한다. 버전은 절대 하드코딩하지 않는다.

### 1-2. 페이지 목록 수집 (fallback 체인)
아래 순서대로 시도하고 성공한 것을 사용해:
1. context7 MCP libraryId: /llmstxt/nextjs_llms-full_txt
2. context7 MCP libraryId: /vercel/next.js/v{감지한버전}
3. context7 MCP libraryId: /vercel/next.js
4. WebFetch: https://nextjs.org/docs/llms.txt

app/getting-started 하위 페이지를 전부 수집한다.
수집에 실패한 페이지는 목록에서 제거하지 말고 "조회 실패"로 표시해 둔다.

### 1-3. 이전 agent 파일 존재 여부 확인
.claude/agents/dev/nextjs-app-developer.md 또는
.claude/agents/dev/nextjs-app-developer-old.md 가 있으면 읽어둔다.
없으면 무시한다. (이후 단계에서 비교 기준으로 사용)

## Step 2: 각 페이지 핵심 키워드 추출

수집한 각 페이지에 대해 context7 MCP로 조회하여
해당 페이지에서 다루는 핵심 개념과 API를 5~10개 키워드로 정리해.

조회 중 아래 항목을 별도로 표시해:
- ⚠️ deprecated 또는 "do not use"로 명시된 API
- 🆕 Step 1-3의 이전 agent에 없던 신규 파일 컨벤션 또는 기능
- 🗑️ 이전 agent에 있었지만 현재 문서에서 사라진 항목

## Step 3: Gotcha 검증

이전 agent(Step 1-3)에 Gotcha 목록이 있다면:
- package.json을 읽어 관련 패키지 버전을 확인한다
- 실제 코드(components/, lib/, app/)를 확인하여 해당 패턴이 여전히 존재하는지 검증한다
- 해결됐거나 더 이상 해당 없는 항목은 제거한다
- 새로 발견된 주의사항은 추가한다

이전 agent가 없으면 이 단계는 건너뛴다.

## Step 4: agent_prompt.md 작성

아래 형식으로 docs/dev/agent_prompt.md 를 작성해.

### 파일 헤더 (파일 최상단에 반드시 포함)
- 생성 날짜 (오늘 날짜)
- 기준 Next.js 버전 (Step 1-1에서 감지한 버전)
- 사용한 context7 libraryId
- 조회 실패한 페이지 목록 (있을 경우)

### 파일 형식

---
# nextjs-app-developer Agent 생성 프롬프트

(이 파일의 목적 한 줄 설명)

---

## 사용법

(사용 방법 설명)

---

## 프롬프트

(아래 내용을 코드 블록으로 감싸서 작성)

  다음 Next.js 공식 문서 N개 페이지를 context7 MCP로 모두 조회한 뒤,
  조회한 내용 전체를 기반으로 .claude/agents/dev/nextjs-app-developer.md 파일을 새로 작성해줘.

  ## 조회할 페이지 (context7 libraryId: {Step 1에서 성공한 libraryId})

  (Step 2에서 추출한 페이지 번호. 페이지명 — 키워드 목록 형식으로 전부 나열)
  (⚠️ deprecated API, 🆕 신규 항목, 🗑️ 삭제 항목 표시 포함)

  ## agent 파일 형식

  frontmatter:
  - name: nextjs-app-developer
  - description: 한국어로 작성, 언제 이 agent를 써야 하는지 명확히 기술, <example> 3개 포함
  - model: sonnet
  - color: blue
  - memory: project

  본문 구성:

  ### 고정 섹션 (버전과 무관하게 항상 포함)
  - 핵심 정체성 — 감지한 Next.js 버전 명시, 해당 버전의 주요 변경사항 강조
  - 프로젝트 컨텍스트 — invoice-web 기술스택/디렉토리/환경변수 명시
  - 프로젝트 특화 Gotcha — Step 3에서 검증된 주의사항만 포함
  - 품질 체크리스트 — 카테고리별 체크 항목

  ### 유동 섹션 (Step 2에서 수집한 페이지 내용 기반으로 구성)
  Step 1~2에서 수집한 페이지 목록과 내용을 분석하여
  의미 있는 주제별로 섹션을 직접 구성할 것.
  예: 파일 컨벤션 / 코드 패턴 / 서버·클라이언트 컴포넌트 /
      데이터 패턴 / 라우팅 패턴 / 최적화 / 신규 기능 등
  → 페이지가 추가·제거·통합되면 섹션도 그에 맞게 조정
  → ⚠️ deprecated로 표시된 API는 "❌ 사용 금지" 형태로 명시하거나 제외
  → 🆕 신규 파일 컨벤션은 별도 섹션 또는 강조 표시로 눈에 띄게 작성

  ## 작성 규칙
  - 모든 설명은 한국어
  - 코드 예시는 TypeScript, 주석은 한국어
  - named export 사용 (default export 지양)
  - @/ 경로 별칭 사용
  - 코드 예시는 실제 작동하는 패턴만 포함
  - MCP 도구 활용 가이드는 포함하지 않음 (Claude가 자체 판단)

## 주의사항
- docs/dev/agent_prompt.md 에 저장
- 프롬프트 본문은 반드시 코드 블록(```) 으로 감쌀 것
- 페이지 수(N)는 실제 수집한 개수로 대체
- context7 libraryId는 Step 1에서 실제로 성공한 것으로 대체
- Next.js 버전은 훈련 데이터 기반으로 추정하지 말고 Step 1-1에서 감지한 값으로 대체
```

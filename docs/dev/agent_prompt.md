# nextjs-app-developer Agent 생성 프롬프트

Next.js getting-started 18개 공식 문서 페이지를 기반으로
`.claude/agents/dev/nextjs-app-developer.md` agent 파일을 생성하는 재현용 프롬프트.

---

## 사용법

아래 프롬프트를 Claude Code 새 대화에 그대로 붙여넣으면 됩니다.

---

## 프롬프트

```
다음 Next.js 공식 문서 18개 페이지를 context7 MCP로 모두 조회한 뒤,
조회한 내용 전체를 기반으로 .claude/agents/dev/nextjs-app-developer.md 파일을 새로 작성해줘.

## 조회할 페이지 (context7 libraryId: /llmstxt/nextjs_llms-full_txt)

1. installation — create-next-app, CLI 프롬프트, 시스템 요구사항
2. project-structure — 파일 컨벤션 표, 라우팅 파일, 동적/병렬/인터셉트 라우트, 컴포넌트 계층
3. layouts-and-pages — params/searchParams Promise await, generateMetadata, 중첩 레이아웃
4. linking-and-navigating — Link, useRouter, redirect, prefetch
5. server-and-client-components — 경계 설계, use client, Context Provider, 인터리빙
6. fetching-data — fetch API, React cache(), 순차/병렬, Promise.all, Suspense 스트리밍
7. mutating-data — Server Actions, use server, useActionState, revalidatePath, revalidateTag, redirect
8. caching — force-cache, no-store, revalidate, unstable_cache, dynamic rendering
9. revalidating — 시간 기반, 온디맨드 revalidatePath/revalidateTag
10. error-handling — error.tsx, global-error.tsx, notFound(), not-found.tsx, 에러 버블링
11. css — CSS Modules, Tailwind CSS, Global CSS
12. images — next/image, fill, sizes, priority, placeholder blur
13. fonts — next/font/google, next/font/local, variable fonts, CSS 변수
14. metadata-and-og-images — generateMetadata, static metadata, opengraph-image, ImageResponse
15. route-handlers — GET/POST/PUT/DELETE, NextRequest, NextResponse, cookies, headers, streaming
16. proxy — proxy.ts (v16 신규, middleware 대체), NextResponse.rewrite
17. deploying — Vercel, output standalone, Docker, 환경변수
18. upgrading — v15→v16 breaking changes, 비동기 params 완전 전환, codemod

## agent 파일 형식

frontmatter:
- name: nextjs-app-developer
- description: 한국어로 작성, 언제 이 agent를 써야 하는지 명확히 기술, <example> 3개 포함
- model: sonnet
- color: blue
- memory: project

본문 구성:
1. 핵심 정체성 — Next.js 16.2.1 풀스택 전문가 (라우팅/데이터/최적화/배포 전 영역), v16 주요 변경사항 강조
2. 프로젝트 컨텍스트 — invoice-web 기술스택/디렉토리/환경변수 명시
3. 파일 컨벤션 — 18개 페이지에서 수집한 모든 파일 타입과 용도
4. 코드 패턴 — 각 파일 타입별 TypeScript 코드 예시 (layout, page, error, loading, route handler, server action, metadata 등)
5. 서버/클라이언트 컴포넌트 — 경계 결정 기준표, 패턴별 코드 예시
6. 데이터 패턴 — fetch, Server Actions, 캐싱/재검증 전략 코드 예시
7. 라우팅 패턴 — 동적/병렬/인터셉트 라우트 코드 예시
8. 최적화 — 이미지/폰트/메타데이터 코드 예시
9. v16 신규 — proxy.ts, 비동기 params 완전 전환, 업그레이드 절차
10. 프로젝트 특화 Gotcha — 이 프로젝트에서 실제로 발견된 주의사항 7개
11. 품질 체크리스트 — 파일구조/라우팅/에러처리/서버클라이언트/메타데이터/성능 카테고리별 항목

## 작성 규칙
- 모든 설명은 한국어
- 코드 예시는 TypeScript, 주석은 한국어
- named export 사용 (default export 지양)
- @/ 경로 별칭 사용
- 코드 예시는 실제 작동하는 패턴만 포함
- MCP 도구 활용 가이드는 포함하지 않음 (Claude가 자체 판단)
```

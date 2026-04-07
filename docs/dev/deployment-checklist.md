# 배포 체크리스트

노션 기반 견적서 관리 시스템의 프로덕션 배포를 위한 체크리스트입니다.

---

## 1. Vercel 환경변수 설정

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 아래 변수를 설정합니다.

| 환경변수 | 필수 여부 | 설명 |
|---------|----------|------|
| `NOTION_API_KEY` | 필수 | Notion Integration Token (Secret) |
| `NOTION_INVOICES_DATABASE_ID` | 필수 | 견적서 데이터베이스 ID |
| `NOTION_ITEMS_DATABASE_ID` | 필수 | 견적 항목 데이터베이스 ID |
| `ADMIN_PASSWORD` | 필수 | 관리자 로그인 비밀번호 |
| `NEXT_PUBLIC_APP_URL` | 필수 | 배포 URL (예: `https://invoice.example.com`) |

### 환경변수 설정 시 주의사항

- `NOTION_API_KEY`는 Notion Integration 설정 페이지에서 발급합니다.
- `NOTION_INVOICES_DATABASE_ID`는 노션 데이터베이스 URL에서 추출합니다.
  - URL 형식: `https://notion.so/[workspace]/[DATABASE_ID]?v=...`
- `ADMIN_PASSWORD`는 추측하기 어려운 강력한 비밀번호를 사용합니다 (최소 16자 권장).
- `NEXT_PUBLIC_APP_URL`은 후행 슬래시 없이 설정합니다 (예: `https://invoice.example.com`).
- 개발(Development), 프리뷰(Preview), 프로덕션(Production) 환경별로 별도 설정을 권장합니다.

---

## 2. Notion API 연동 확인 사항

배포 전 아래 항목을 Notion 워크스페이스에서 확인합니다.

### Integration 설정

- [ ] Notion Integration이 생성되어 있음
- [ ] Integration Token이 발급되어 있음 (`secret_...` 형식)
- [ ] Integration에 **읽기** 권한이 부여되어 있음

### 데이터베이스 공유 설정

- [ ] 견적서 데이터베이스에 Integration이 연결되어 있음 (데이터베이스 → 우측 상단 ··· → Connections)
- [ ] 견적 항목 데이터베이스에 Integration이 연결되어 있음
- [ ] 두 데이터베이스 모두 Integration의 **읽기 접근**이 허용되어 있음

### 데이터베이스 스키마 확인

- [ ] 견적서 데이터베이스에 필수 속성이 존재함:
  - `이름` (Title 타입)
  - `클라이언트명` (Text 또는 Rich Text 타입)
  - `발행일` (Date 타입)
  - `유효기간` (Date 타입)
  - `상태` (Select 타입: 대기/승인/거절)
  - `총액` (Number 타입)
- [ ] 견적 항목 데이터베이스에 필수 속성이 존재함:
  - `이름` (Title 타입)
  - `견적서` (Relation 타입 — 견적서 DB와 연결)
  - `수량`, `단가`, `금액` (Number 타입)

---

## 3. 배포 전 테스트 체크리스트

### 로컬 환경 테스트

- [ ] `npm run build` 빌드 성공 (TypeScript 오류 없음)
- [ ] `npm run start`로 프로덕션 서버 실행 정상
- [ ] `.env.local`에 모든 환경변수 설정 후 기능 동작 확인

### 기능 테스트

**관리자 인증:**
- [ ] `/admin/login`에서 올바른 비밀번호로 로그인 성공
- [ ] 잘못된 비밀번호 입력 시 오류 메시지 표시
- [ ] 미인증 상태에서 `/admin/invoices` 접근 시 로그인 페이지로 리다이렉트
- [ ] 로그아웃 후 관리자 페이지 접근 불가

**견적서 목록:**
- [ ] Notion에서 견적서 데이터 정상 로드
- [ ] 테이블에 모든 컬럼 데이터가 올바르게 표시됨
- [ ] 페이지네이션 이전/다음 버튼 동작
- [ ] 컬럼 헤더 클릭 시 정렬 적용

**검색 및 필터:**
- [ ] 클라이언트명 키워드 검색 결과 정확
- [ ] 견적서 번호 검색 결과 정확
- [ ] 상태 필터 선택 시 해당 상태만 표시
- [ ] 날짜 범위 필터 적용 시 기간 내 견적서만 표시
- [ ] 검색어 하이라이팅 정상 표시

**링크 기능:**
- [ ] 링크 컬럼에 올바른 URL 표시 (`/invoice/[notionPageId]`)
- [ ] 복사 버튼 클릭 시 클립보드에 URL 복사
- [ ] 복사 성공 토스트 알림 표시
- [ ] 외부 링크 아이콘으로 새 탭 열기 동작

**견적서 조회 (클라이언트 뷰):**
- [ ] 복사된 링크로 `/invoice/[id]` 페이지 정상 접근
- [ ] 견적서 내용이 올바르게 표시됨
- [ ] 존재하지 않는 ID 접근 시 404 페이지 표시

### 성능 테스트

- [ ] 관리자 목록 페이지 초기 로드 2초 이내
- [ ] 검색/필터 응답 속도 양호

### 보안 테스트

- [ ] `ADMIN_PASSWORD` 환경변수가 클라이언트 번들에 노출되지 않음 (`NEXT_PUBLIC_` 접두사 없음 확인)
- [ ] `NOTION_API_KEY` 환경변수가 클라이언트 번들에 노출되지 않음
- [ ] 관리자 API 엔드포인트에 인증 없이 접근 불가
- [ ] HTTPS 환경에서 배포됨 (Vercel 기본 제공)

---

## 4. Vercel 배포 절차

### 최초 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 연결 및 배포
vercel --prod
```

또는 GitHub 연동을 통한 자동 배포:
1. Vercel 대시보드에서 **Add New Project** 클릭
2. GitHub 저장소 선택
3. 환경변수 입력 후 **Deploy** 클릭

### 이후 배포 (CI/CD)

`main` 브랜치에 push 시 Vercel이 자동으로 프로덕션 배포를 수행합니다.

```bash
# 배포 상태 확인
vercel ls
vercel inspect [deployment-url]
```

### vercel.json 설정

현재 프로젝트의 `vercel.json` 설정을 확인합니다:

```json
{
  "framework": "nextjs"
}
```

---

## 5. 배포 후 확인 사항

- [ ] 프로덕션 URL에서 홈 페이지(`/`) 정상 로드
- [ ] `/admin/login` 페이지 정상 표시
- [ ] 환경변수 기반 로그인 정상 동작
- [ ] Notion API 연동 정상 (견적서 목록 로드)
- [ ] 링크 복사 기능 정상 (HTTPS 환경에서 Clipboard API 동작)
- [ ] 존재하지 않는 경로 접근 시 404 페이지 표시
- [ ] Vercel 대시보드에서 빌드 로그 오류 없음

---

## 6. 문제 해결 가이드

### 견적서 목록이 빈 경우

1. Vercel 환경변수 `NOTION_API_KEY` 설정 확인
2. `NOTION_INVOICES_DATABASE_ID` 값 확인 (하이픈 없는 32자 ID 또는 하이픈 포함 UUID)
3. Notion 데이터베이스에 Integration 연결 확인
4. Vercel 함수 로그에서 에러 확인: Vercel 대시보드 → Deployments → Functions

### 관리자 로그인 실패

1. Vercel 환경변수 `ADMIN_PASSWORD` 설정 확인
2. 비밀번호에 특수문자가 포함된 경우 URL 인코딩 이슈 확인
3. Vercel serverless 환경에서의 세션 초기화 여부 확인

### 빌드 실패

1. 로컬에서 `npm run build` 실행하여 오류 재현
2. `npx tsc --noEmit`으로 TypeScript 오류 확인
3. Node.js 버전 확인 (권장: 20.x 이상)

# 계획: docs/PRD.md 노션 데이터베이스 스키마 수정

## Context
PRD의 데이터 모델 섹션에서 노션 DB 필드명을 영문 컬럼명으로 통일하고,
사용자가 제공한 실제 스키마로 교체한다.

## 수정 대상 파일
- `docs/PRD.md` — 🗄️ 데이터 모델 섹션 (110~154행)

## 변경 내용

### Notion Database (견적서 정보) 테이블 교체
| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| invoice_code | 견적서 코드 | String (Notion Title) |
| client_name | 클라이언트명 | String |
| issued_at | 발행일 | Date |
| expires_at | 유효기간 | Date |
| status | 견적서 상태 | Select (pending \| rejected \| approved) |
| total_amount | 총 금액 | Number |
| item | 견적 항목 | Relation → Items DB |

### Notion Database Items (견적 항목) 테이블 교체
| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| item_code | 항목 코드 | String (Notion Title) |
| item_name | 항목명 | String |
| quantity | 수량 | Number |
| unit_price | 단가 | Number |
| amount | 금액 (단가 × 수량) | Formula |
| invoice | 연결된 견적서 | Relation → Invoices DB (양방향) |

### 노션 데이터베이스 구조 예시 코드블록 교체
Invoices / Items 트리를 새 필드명에 맞게 업데이트

## 제약
- 데이터 모델 섹션 외 나머지 내용은 일체 수정하지 않음

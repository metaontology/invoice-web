/**
 * Notion API compound filter 빌더 유틸리티
 *
 * Invoices DB의 실제 프로퍼티명 (notion-parser.ts 참조):
 * - invoice_code: title
 * - client_name: rich_text
 * - issued_at: date
 * - status: select (pending | rejected | approved)
 */

/** 검색/필터 파라미터 인터페이스 */
export interface SearchFilterParams {
  /** 검색어 (client_name 또는 invoice_code에서 검색) */
  q?: string
  /** 상태 필터 (InvoiceStatus: 'pending' | 'approved' | 'rejected') */
  status?: string
  /** 날짜 범위 시작 (YYYY-MM-DD) */
  from?: string
  /** 날짜 범위 끝 (YYYY-MM-DD) */
  to?: string
}

/** Notion PropertyFilter 타입 (단일 프로퍼티 필터) */
type NotionPropertyFilter =
  | { property: string; title: { contains: string } }
  | { property: string; rich_text: { contains: string } }
  | { property: string; select: { equals: string } }
  | { property: string; date: { on_or_after: string } }
  | { property: string; date: { on_or_before: string } }

/** Notion 복합 필터 타입 */
type NotionCompoundFilter =
  | { or: NotionPropertyFilter[] }
  | { and: NotionFilter[] }
  | NotionPropertyFilter

/** Notion filter 파라미터로 전달 가능한 최상위 타입 */
type NotionFilter = NotionCompoundFilter

/**
 * SearchFilterParams를 Notion API filter 객체로 변환합니다.
 *
 * 변환 규칙:
 * - q: client_name (rich_text contains) OR invoice_code (title contains)
 * - status: status (select equals)
 * - from: issued_at (date on_or_after)
 * - to: issued_at (date on_or_before)
 * - 여러 조건은 and로 묶음
 * - 조건이 없으면 undefined 반환
 */
export function buildNotionFilter(
  params: SearchFilterParams
): NotionFilter | undefined {
  const { q, status, from, to } = params
  const conditions: NotionFilter[] = []

  // 검색어: client_name OR invoice_code
  if (q && q.trim()) {
    const trimmedQ = q.trim()
    conditions.push({
      or: [
        {
          property: "client_name",
          rich_text: { contains: trimmedQ },
        },
        {
          property: "invoice_code",
          title: { contains: trimmedQ },
        },
      ],
    })
  }

  // 상태 필터
  if (status && status.trim()) {
    conditions.push({
      property: "status",
      select: { equals: status.trim() },
    })
  }

  // 날짜 범위 시작
  if (from && from.trim()) {
    conditions.push({
      property: "issued_at",
      date: { on_or_after: from.trim() },
    })
  }

  // 날짜 범위 끝
  if (to && to.trim()) {
    conditions.push({
      property: "issued_at",
      date: { on_or_before: to.trim() },
    })
  }

  // 조건이 없으면 undefined 반환
  if (conditions.length === 0) return undefined

  // 조건이 1개면 그대로, 여러 개면 and로 묶음
  if (conditions.length === 1) return conditions[0]

  return { and: conditions }
}

import { unstable_cache } from "next/cache"
import type { Invoice } from "@/types/invoice"
import type { NotionPage } from "@/types/notion"
import { getNotionClient } from "@/lib/notion"
import { parseInvoicePage } from "@/lib/utils/notion-parser"
import { buildNotionFilter } from "@/lib/utils/search-filter"
import { CACHE_TTL } from "@/lib/config"

/** 견적서 목록 조회 파라미터 */
export interface InvoiceListParams {
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 정렬 컬럼: 'issued_at' | 'client_name' | 'total_amount' */
  sort?: string
  /** 정렬 방향 */
  order?: "asc" | "desc"
  /** 검색어 (client_name 또는 invoice_code) */
  q?: string
  /** 상태 필터 */
  status?: string
  /** 발행일 범위 시작 (YYYY-MM-DD) */
  from?: string
  /** 발행일 범위 끝 (YYYY-MM-DD) */
  to?: string
}

/** 견적서 목록 조회 결과 */
export interface InvoiceListResult {
  invoices: Invoice[]
  hasMore: boolean
  nextCursor: string | null
}

/** 페이지당 항목 수 */
const PAGE_SIZE = 10

/**
 * 정렬 컬럼명을 Notion DB 프로퍼티명으로 변환
 * notion-parser.ts에서 사용하는 실제 프로퍼티명과 일치해야 합니다.
 */
function toNotionSortProperty(sort: string): string {
  const mapping: Record<string, string> = {
    issued_at: "issued_at",
    client_name: "client_name",
    total_amount: "total_amount",
  }
  return mapping[sort] ?? "issued_at"
}

/**
 * Notion Invoices DB에서 견적서 목록을 조회합니다. (내부 함수)
 *
 * 페이지네이션은 커서 기반으로 동작하나, URL page 파라미터와의 연동을 위해
 * page 1은 start_cursor 없이, page > 1은 직전 페이지의 nextCursor가 필요합니다.
 * 실용적 단순화: hasMore 여부로 이전/다음 버튼 활성화 제어.
 *
 * @param params - 페이지 번호, 정렬 컬럼, 정렬 방향
 * @param startCursor - Notion 커서 (page > 1일 때 이전 조회의 next_cursor)
 */
async function getInvoiceListRaw(
  params: InvoiceListParams,
  startCursor?: string
): Promise<InvoiceListResult> {
  const { sort = "issued_at", order = "desc", q, status, from, to } = params

  // 검색/필터 조건 빌드
  const filter = buildNotionFilter({ q, status, from, to })

  // Notion dataSources.query 호출 (v5 패턴)
  const result = await getNotionClient().dataSources.query({
    data_source_id: process.env.NOTION_INVOICES_DATABASE_ID!,
    page_size: PAGE_SIZE,
    sorts: [
      {
        property: toNotionSortProperty(sort),
        direction: order === "asc" ? "ascending" : "descending",
      },
    ],
    ...(startCursor ? { start_cursor: startCursor } : {}),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(filter ? { filter: filter as any } : {}),
  })

  // page 타입 결과만 필터링 후 Invoice 변환 (items는 빈 배열 — API 호출 최소화)
  const invoices = result.results
    .filter((p): p is typeof p & { object: "page" } => p.object === "page")
    .map((p) => parseInvoicePage(p as NotionPage, []))

  return {
    invoices,
    hasMore: result.has_more,
    nextCursor: result.next_cursor ?? null,
  }
}

/**
 * Notion Invoices DB에서 견적서 목록을 조회합니다. (캐시 적용)
 *
 * 정렬 조건이 캐시 키에 포함되어 정렬 변경 시 새로운 데이터를 조회합니다.
 */
export const getInvoiceList = unstable_cache(getInvoiceListRaw, ["invoice-list"], {
  revalidate: CACHE_TTL,
  tags: ["invoice-list"],
})

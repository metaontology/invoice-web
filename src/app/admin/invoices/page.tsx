import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { InvoiceTable } from "@/components/admin/invoice-table"
import { SearchBar } from "@/components/admin/search-bar"
import { FilterPanel } from "@/components/admin/filter-panel"
import { getInvoiceList } from "@/lib/services/invoice-list.service"
import Link from "next/link"

export const metadata: Metadata = {
  title: "견적서 목록 | 관리자",
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    sort?: string
    order?: string
    q?: string
    status?: string
    from?: string
    to?: string
  }>
}

/**
 * 관리자 견적서 목록 페이지
 * Notion DB의 모든 견적서를 테이블로 표시하며 페이지네이션, 정렬, 검색/필터를 지원합니다.
 */
export default async function InvoicesPage({ searchParams }: PageProps) {
  const { page: pageStr, sort, order, q, status, from, to } = await searchParams

  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1)
  const sortCol = sort ?? "issued_at"
  const sortOrder = (order === "asc" ? "asc" : "desc") as "asc" | "desc"

  // 견적서 목록 조회 (검색/필터 파라미터 포함)
  const result = await getInvoiceList(
    { page, sort: sortCol, order: sortOrder, q, status, from, to },
    undefined
  )

  const prevPage = page - 1
  const nextPage = page + 1

  /**
   * 현재 searchParams를 유지하면서 page 값만 변경한 URL 생성
   */
  function buildPageUrl(targetPage: number): string {
    const params = new URLSearchParams()
    params.set("page", String(targetPage))
    if (sort) params.set("sort", sort)
    if (order) params.set("order", order)
    if (q) params.set("q", q)
    if (status) params.set("status", status)
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    return `?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 목록</h1>
        <p className="text-muted-foreground">
          Notion 데이터베이스의 견적서를 조회합니다.
        </p>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-sm">
          <SearchBar />
        </div>
        <FilterPanel />
      </div>

      {/* 견적서 테이블 */}
      <InvoiceTable
        invoices={result.invoices}
        currentSort={sortCol}
        currentOrder={sortOrder}
        query={q}
      />

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {page} 페이지
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link href={buildPageUrl(prevPage)}>이전</Link>
            ) : (
              <span>이전</span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!result.hasMore}
            asChild={result.hasMore}
          >
            {result.hasMore ? (
              <Link href={buildPageUrl(nextPage)}>다음</Link>
            ) : (
              <span>다음</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

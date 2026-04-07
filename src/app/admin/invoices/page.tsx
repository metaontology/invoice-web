import { Suspense } from "react"
import type { Metadata } from "next"
import { SearchBar } from "@/components/admin/search-bar"
import { FilterPanel } from "@/components/admin/filter-panel"
import { InvoiceList } from "@/components/admin/invoice-list"
import { InvoiceListSkeleton } from "@/components/admin/invoice-list-skeleton"

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
 *
 * InvoiceList 컴포넌트를 Suspense로 감싸 Notion API 응답 대기 중 스켈레톤 UI를 표시합니다.
 * searchParams가 변경될 때마다 Suspense 경계가 재활성화되어 로딩 상태가 표시됩니다.
 */
export default async function InvoicesPage({ searchParams }: PageProps) {
  const { page: pageStr, sort, order, q, status, from, to } =
    await searchParams

  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1)
  const sortCol = sort ?? "issued_at"
  const sortOrder = (order === "asc" ? "asc" : "desc") as "asc" | "desc"

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 목록</h1>
        <p className="text-muted-foreground">
          Notion 데이터베이스의 견적서를 조회합니다.
        </p>
      </div>

      {/* 검색 및 필터 영역 — 즉시 렌더링 (API 호출 없음) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-sm">
          <SearchBar />
        </div>
        <FilterPanel />
      </div>

      {/* 견적서 목록 + 페이지네이션 — Notion API 응답까지 스켈레톤 표시 */}
      <Suspense key={`${page}-${sortCol}-${sortOrder}-${q}-${status}-${from}-${to}`} fallback={<InvoiceListSkeleton />}>
        <InvoiceList
          page={page}
          sort={sortCol}
          order={sortOrder}
          q={q}
          status={status}
          from={from}
          to={to}
        />
      </Suspense>
    </div>
  )
}

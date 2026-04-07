import { InvoiceTable } from "@/components/admin/invoice-table"
import { Button } from "@/components/ui/button"
import { getInvoiceList } from "@/lib/services/invoice-list.service"
import Link from "next/link"

interface InvoiceListProps {
  page: number
  sort: string
  order: "asc" | "desc"
  q?: string
  status?: string
  from?: string
  to?: string
}

/**
 * 현재 searchParams를 유지하면서 page 값만 변경한 URL을 생성합니다.
 */
function buildPageUrl(
  targetPage: number,
  params: Omit<InvoiceListProps, "page">
): string {
  const searchParams = new URLSearchParams()
  searchParams.set("page", String(targetPage))
  if (params.sort) searchParams.set("sort", params.sort)
  if (params.order) searchParams.set("order", params.order)
  if (params.q) searchParams.set("q", params.q)
  if (params.status) searchParams.set("status", params.status)
  if (params.from) searchParams.set("from", params.from)
  if (params.to) searchParams.set("to", params.to)
  return `?${searchParams.toString()}`
}

/**
 * 견적서 목록 + 페이지네이션 서버 컴포넌트
 * Notion API 호출을 담당하며 Suspense 경계 안에서 스트리밍됩니다.
 */
export async function InvoiceList({
  page,
  sort,
  order,
  q,
  status,
  from,
  to,
}: InvoiceListProps) {
  // Notion API에서 견적서 목록 조회
  const result = await getInvoiceList(
    { page, sort, order, q, status, from, to },
    undefined
  )

  const prevPage = page - 1
  const nextPage = page + 1
  const paginationParams = { sort, order, q, status, from, to }

  return (
    <>
      {/* 견적서 테이블 */}
      <InvoiceTable
        invoices={result.invoices}
        currentSort={sort}
        currentOrder={order}
        query={q}
      />

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{page} 페이지</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link href={buildPageUrl(prevPage, paginationParams)}>이전</Link>
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
              <Link href={buildPageUrl(nextPage, paginationParams)}>다음</Link>
            ) : (
              <span>다음</span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

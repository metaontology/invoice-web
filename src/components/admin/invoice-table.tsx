"use client"

import type { ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/status-badge"
import type { Invoice } from "@/types/invoice"

/** 정렬 가능한 컬럼 정의 */
const SORTABLE_COLUMNS = [
  { key: "invoice_code", label: "견적서 번호", sortable: false },
  { key: "client_name", label: "클라이언트명", sortable: true },
  { key: "issued_at", label: "발행일", sortable: true },
  { key: "status", label: "상태", sortable: false },
  { key: "total_amount", label: "총액", sortable: true },
] as const

type SortableKey = "client_name" | "issued_at" | "total_amount"

interface InvoiceTableProps {
  invoices: Invoice[]
  currentSort?: string
  currentOrder?: "asc" | "desc"
  /** 검색어 (하이라이팅에 사용) */
  query?: string
}

/**
 * 발행일 문자열을 'YYYY년 MM월 DD일' 형식으로 변환
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 금액을 한국어 형식으로 포맷 (예: 1,000,000 원)
 */
function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + " 원"
}

/**
 * 텍스트에서 검색어와 일치하는 부분을 하이라이팅합니다.
 * 대소문자 구분 없이 매칭하며, 일치 부분을 mark 태그로 감쌉니다.
 *
 * @param text - 원본 텍스트
 * @param query - 검색어 (없거나 빈 문자열이면 텍스트 그대로 반환)
 */
function highlightText(text: string, query?: string): ReactNode {
  if (!query || !query.trim() || !text) return text

  const trimmedQuery = query.trim()
  // 대소문자 구분 없이 검색어를 찾기 위한 정규식
  const regex = new RegExp(`(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  if (parts.length === 1) return text

  // 정규식 `gi` 플래그로 split하면 캡처 그룹이 포함되므로
  // 홀수 인덱스(캡처된 부분)가 하이라이팅 대상입니다.
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={index}
            className="rounded-sm bg-yellow-200 dark:bg-yellow-800"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

/**
 * 정렬 아이콘을 반환합니다.
 */
function SortIcon({
  columnKey,
  currentSort,
  currentOrder,
}: {
  columnKey: string
  currentSort?: string
  currentOrder?: "asc" | "desc"
}) {
  if (currentSort !== columnKey) {
    return <ArrowUpDown className="ml-1 inline-block h-3 w-3 opacity-50" />
  }
  if (currentOrder === "asc") {
    return <ArrowUp className="ml-1 inline-block h-3 w-3" />
  }
  return <ArrowDown className="ml-1 inline-block h-3 w-3" />
}

/**
 * 견적서 목록을 테이블로 표시하는 클라이언트 컴포넌트.
 * 컬럼 클릭으로 정렬 방향을 URL searchParams로 업데이트합니다.
 */
export function InvoiceTable({ invoices, currentSort, currentOrder, query }: InvoiceTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * 정렬 헤더 클릭 핸들러 — URL searchParams 업데이트
   */
  function handleSort(columnKey: SortableKey) {
    const params = new URLSearchParams(searchParams.toString())

    // 동일 컬럼 재클릭 시 방향 토글, 다른 컬럼 클릭 시 desc 기본값
    const newOrder =
      currentSort === columnKey && currentOrder === "desc" ? "asc" : "desc"

    params.set("sort", columnKey)
    params.set("order", newOrder)
    // 정렬 변경 시 첫 페이지로 초기화
    params.set("page", "1")

    router.push(`?${params.toString()}`)
  }

  /**
   * 행 클릭 시 견적서 상세 페이지를 새 탭으로 열기
   */
  function handleRowClick(invoiceId: string) {
    window.open(`/invoice/${invoiceId}`, "_blank")
  }

  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed py-16">
        <p className="text-sm text-muted-foreground">견적서가 없습니다.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableCaption>Notion DB의 전체 견적서 목록</TableCaption>
      <TableHeader>
        <TableRow>
          {SORTABLE_COLUMNS.map((col) => (
            <TableHead key={col.key}>
              {col.sortable ? (
                <button
                  type="button"
                  className="flex cursor-pointer items-center hover:text-foreground"
                  onClick={() => handleSort(col.key as SortableKey)}
                >
                  {col.label}
                  <SortIcon
                    columnKey={col.key}
                    currentSort={currentSort}
                    currentOrder={currentOrder}
                  />
                </button>
              ) : (
                col.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow
            key={invoice.id}
            className="cursor-pointer"
            onClick={() => handleRowClick(invoice.id)}
          >
            <TableCell className="font-mono text-xs">
              {invoice.invoice_code
                ? highlightText(invoice.invoice_code, query)
                : "-"}
            </TableCell>
            <TableCell>
              {invoice.client_name
                ? highlightText(invoice.client_name, query)
                : "-"}
            </TableCell>
            <TableCell>{formatDate(invoice.issued_at)}</TableCell>
            <TableCell>
              <StatusBadge status={invoice.status} />
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatAmount(invoice.total_amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

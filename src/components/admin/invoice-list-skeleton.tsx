import { Skeleton } from "@/components/ui/skeleton"

/**
 * 견적서 목록 로딩 스켈레톤
 * InvoiceList를 Suspense로 감쌀 때 fallback으로 사용합니다.
 */
export function InvoiceListSkeleton() {
  return (
    <div className="space-y-4">
      {/* 테이블 헤더 스켈레톤 */}
      <div className="rounded-lg border">
        <div className="flex gap-4 border-b px-4 py-3">
          {[120, 140, 100, 80, 100, 60].map((width, i) => (
            <Skeleton key={i} className="h-4" style={{ width }} />
          ))}
        </div>

        {/* 테이블 행 스켈레톤 — 10행 */}
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 border-b px-4 py-3 last:border-0">
            {[120, 140, 100, 80, 100, 60].map((width, colIndex) => (
              <Skeleton key={colIndex} className="h-4" style={{ width }} />
            ))}
          </div>
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
        </div>
      </div>
    </div>
  )
}

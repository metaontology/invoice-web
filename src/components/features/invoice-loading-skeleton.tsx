import { Skeleton } from "@/components/ui/skeleton"

/** 견적서 페이지 전용 스켈레톤 로딩 UI — page.tsx 레이아웃 구조와 동일 */
export function InvoiceLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-8">
          {/* 헤더 영역 — 견적서 번호, 날짜, 버튼 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              {/* 견적서 번호 */}
              <Skeleton className="h-7 w-40" />
              {/* 발행일 + 유효기간 */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            {/* 상태 배지 + 다운로드 버튼 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>

          {/* 고객사 섹션 — 카드 형태 */}
          <div className="border rounded-lg p-6 space-y-4">
            {/* 섹션 제목 */}
            <Skeleton className="h-5 w-20" />
            <div className="flex flex-col gap-3">
              {/* 레이블 + 값 행 */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>

          {/* 견적 항목 테이블 */}
          <div className="border rounded-lg overflow-hidden">
            {/* 테이블 헤더 행 — 6컬럼 */}
            <div className="flex items-center gap-4 p-4 border-b bg-muted/50">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-24 flex-1" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* 테이블 데이터 행 — 5개 */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0">
                <Skeleton className="h-12 w-8" />
                <Skeleton className="h-4 w-24 flex-1" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* 합계 섹션 */}
          <div className="space-y-3">
            {/* 구분선 */}
            <div className="h-px w-full bg-border" />
            {/* 오른쪽 정렬 합계 */}
            <div className="flex justify-end">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>

          {/* PDF 다운로드 버튼 영역 — 우측 정렬 */}
          <div className="flex justify-end">
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
      </div>
    </div>
  )
}

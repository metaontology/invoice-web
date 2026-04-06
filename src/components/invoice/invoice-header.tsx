// 견적서 헤더 컴포넌트 — 견적서 코드, 발행일, 유효기간, 상태 표시
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/types/invoice"

interface InvoiceHeaderProps {
  invoice_code: string
  issued_at: string
  expires_at: string
  status: InvoiceStatus
  className?: string
}

/** 상태별 Badge variant 매핑 */
const statusVariantMap: Record<InvoiceStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
}

/** 상태별 한국어 레이블 */
const statusLabelMap: Record<InvoiceStatus, string> = {
  pending: "검토중",
  approved: "승인됨",
  rejected: "반려됨",
}

export function InvoiceHeader({
  invoice_code,
  issued_at,
  expires_at,
  status,
  className,
}: InvoiceHeaderProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* 좌측: 견적서 제목 및 코드 */}
          <div className="flex items-center gap-3">
            <FileText className="size-7 text-muted-foreground shrink-0" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">견적서</h1>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">{invoice_code}</p>
            </div>
          </div>

          {/* 우측: 상태 배지 + 날짜 (레이블 너비 고정으로 값 정렬) */}
          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariantMap[status]}>
              {statusLabelMap[status]}
            </Badge>
            <div className="space-y-1 text-sm">
              {/* 발행일 */}
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0 sm:text-right">발행일</span>
                <span className="font-medium text-foreground">{formatDate(issued_at)}</span>
              </div>
              {/* 유효기간 */}
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0 sm:text-right">유효기간</span>
                <span className="font-medium text-foreground">{formatDate(expires_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

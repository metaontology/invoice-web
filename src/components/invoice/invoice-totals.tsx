// 견적서 합계 금액 컴포넌트 — 카드 내 합계 레이블과 금액 양쪽 정렬 표시
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format"
import { cn } from "@/lib/utils"

interface InvoiceTotalsProps {
  total_amount: number
  className?: string
}

export function InvoiceTotals({ total_amount, className }: InvoiceTotalsProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      {/* CardContent 충돌 우회: Card 직접 자식 div로 flex 레이아웃 보장 */}
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-sm font-medium text-muted-foreground">합계</span>
        <span className="text-2xl font-bold tabular-nums">
          {formatCurrency(total_amount)}
        </span>
      </div>
    </Card>
  )
}

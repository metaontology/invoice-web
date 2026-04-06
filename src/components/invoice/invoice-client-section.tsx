// 견적서 고객사 정보 섹션 컴포넌트
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InvoiceClientSectionProps {
  client_name: string
  className?: string
}

export function InvoiceClientSection({ client_name, className }: InvoiceClientSectionProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-6">
        {/* 섹션 레이블 */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          고객사
        </p>
        {/* 고객사명 */}
        <p className="text-lg font-semibold text-foreground">{client_name}</p>
      </CardContent>
    </Card>
  )
}

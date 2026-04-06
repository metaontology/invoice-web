import { Badge } from "@/components/ui/badge"
import type { InvoiceStatus } from "@/types/invoice"

/** 상태별 Badge variant 및 표시 텍스트 설정 */
const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline"
    label: string
  }
> = {
  pending: { variant: "secondary", label: "대기" },
  approved: { variant: "default", label: "승인" },
  rejected: { variant: "destructive", label: "거절" },
}

interface StatusBadgeProps {
  status: InvoiceStatus
}

/**
 * 견적서 상태를 색상으로 구분된 배지로 표시합니다.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending

  return <Badge variant={config.variant}>{config.label}</Badge>
}

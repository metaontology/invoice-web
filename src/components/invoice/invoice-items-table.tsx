// 견적서 항목 테이블 컴포넌트 — 품목별 수량, 단가, 금액 표시
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { InvoiceItem } from "@/types/invoice"

interface InvoiceItemsTableProps {
  items: InvoiceItem[]
  className?: string
}

export function InvoiceItemsTable({ items, className }: InvoiceItemsTableProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle className="text-base">견적 항목</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {/* 번호: 중앙 정렬 */}
              <TableHead className="w-12 text-center pl-6 pr-2 py-3">#</TableHead>
              {/* 코드 */}
              <TableHead className="w-28 py-3">코드</TableHead>
              {/* 품명 */}
              <TableHead className="py-3">품명</TableHead>
              {/* 수량: 우측 정렬 */}
              <TableHead className="w-16 text-right py-3">수량</TableHead>
              {/* 단가: 우측 정렬 */}
              <TableHead className="w-32 text-right py-3">단가</TableHead>
              {/* 금액: 우측 정렬 */}
              <TableHead className="w-32 text-right pr-6 py-3">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-muted/30 border-b last:border-b-0">
                {/* 번호: 중앙 정렬 */}
                <TableCell className="text-center pl-6 pr-2 py-4 text-muted-foreground text-sm">
                  {index + 1}
                </TableCell>
                {/* 코드 */}
                <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                  {item.item_code}
                </TableCell>
                {/* 품명 */}
                <TableCell className="py-4 font-medium">{item.item_name}</TableCell>
                {/* 수량 */}
                <TableCell className="py-4 text-right tabular-nums">
                  {item.quantity.toLocaleString("ko-KR")}
                </TableCell>
                {/* 단가 */}
                <TableCell className="py-4 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(item.unit_price)}
                </TableCell>
                {/* 금액 */}
                <TableCell className="py-4 text-right tabular-nums font-semibold pr-6">
                  {formatCurrency(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

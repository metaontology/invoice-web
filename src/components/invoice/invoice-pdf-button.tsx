"use client"

// PDF 다운로드 버튼 — <a href download> 방식으로 브라우저 직접 처리
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvoicePdfButtonProps {
  /** 견적서 Notion 페이지 ID — PDF API 쿼리 파라미터로 전달 */
  notionPageId: string
}

export function InvoicePdfButton({ notionPageId }: InvoicePdfButtonProps) {
  return (
    // asChild: Button 스타일을 <a> 태그에 적용
    // download 속성 + Content-Disposition: attachment 헤더로 자동 다운로드
    <Button asChild variant="outline">
      <a href={"/api/invoice/pdf?id=" + notionPageId} download>
        <Download />
        PDF 다운로드
      </a>
    </Button>
  )
}

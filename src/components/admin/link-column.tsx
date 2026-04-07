"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/admin/copy-button"
import { ShareDropdown } from "@/components/admin/share-dropdown"

interface LinkColumnProps {
  invoiceId: string
  invoiceUrl: string
}

/**
 * 견적서 링크 컬럼 컴포넌트.
 * "새 탭 열기" 버튼과 "링크 복사" 버튼을 나란히 표시합니다.
 * 부모 행의 클릭 이벤트가 전파되지 않도록 각 버튼에서 stopPropagation을 처리합니다.
 */
export function LinkColumn({ invoiceId: _invoiceId, invoiceUrl }: LinkColumnProps) {
  /**
   * 외부 링크 버튼 클릭 핸들러 — 행 클릭 이벤트 전파 차단 후 새 탭 열기
   */
  function handleOpenClick(event: React.MouseEvent<HTMLButtonElement>) {
    // 부모 TableRow의 onClick(handleRowClick) 이벤트 전파 차단
    event.stopPropagation()

    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* 새 탭에서 열기 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenClick}
        aria-label="새 탭에서 견적서 열기"
        title="새 탭에서 견적서 열기"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>

      {/* 링크 복사 버튼 */}
      <CopyButton text={invoiceUrl} ariaLabel="견적서 링크 복사" />

      {/* 공유 드롭다운 버튼 */}
      <ShareDropdown url={invoiceUrl} />
    </div>
  )
}

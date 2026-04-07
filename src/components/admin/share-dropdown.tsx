"use client"

import { useEffect, useState } from "react"
import { Share2, Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareDropdownProps {
  /** 공유할 견적서 URL */
  url: string
}

/**
 * 견적서 공유 드롭다운 컴포넌트.
 * 이메일 공유와 Web Share API(지원 브라우저)를 제공합니다.
 * 부모 행의 클릭 이벤트 전파를 차단합니다.
 */
export function ShareDropdown({ url }: ShareDropdownProps) {
  // Web Share API 지원 여부 — 클라이언트에서만 감지 가능
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    // navigator.share는 SSR에서 접근 불가이므로 마운트 후 확인
    setCanShare(typeof navigator !== "undefined" && !!navigator.share)
  }, [])

  /**
   * 트리거 버튼 클릭 시 부모 TableRow의 onClick 이벤트 전파 차단
   */
  function handleTriggerClick(event: React.MouseEvent) {
    event.stopPropagation()
  }

  /**
   * 이메일 공유 — mailto 링크로 새 탭 열기
   */
  function handleEmailShare(event: React.MouseEvent) {
    event.stopPropagation()

    const subject = encodeURIComponent("견적서 공유")
    const body = encodeURIComponent(url)
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  /**
   * Web Share API 공유 — 브라우저 기본 공유 시트 열기
   */
  async function handleWebShare(event: React.MouseEvent) {
    event.stopPropagation()

    try {
      await navigator.share({
        title: "견적서 공유",
        url,
      })
    } catch (error) {
      // AbortError는 사용자가 취소한 경우이므로 무시
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("공유에 실패했습니다.")
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* 트리거 버튼 클릭 시 행 이동 이벤트 전파 차단 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleTriggerClick}
          aria-label="견적서 공유"
          title="공유"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* 이메일 공유 */}
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="mr-2 h-4 w-4" />
          이메일로 공유
        </DropdownMenuItem>

        {/* Web Share API — 지원하는 브라우저에서만 표시 */}
        {canShare && (
          <DropdownMenuItem onClick={handleWebShare}>
            <Share2 className="mr-2 h-4 w-4" />
            공유하기
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

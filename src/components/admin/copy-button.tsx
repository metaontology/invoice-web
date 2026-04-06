"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  /** 클립보드에 복사할 텍스트 (견적서 URL) */
  text: string
  /** 접근성 레이블 */
  ariaLabel?: string
}

/**
 * 원클릭 링크 복사 버튼 컴포넌트.
 * 클릭 시 텍스트를 클립보드에 복사하고 sonner 토스트로 피드백을 제공합니다.
 * 복사 성공 시 1.5초간 체크 아이콘으로 시각적 피드백을 표시합니다.
 */
export function CopyButton({ text, ariaLabel = "링크 복사" }: CopyButtonProps) {
  // 복사 성공 상태 (체크 아이콘 표시용)
  const [copied, setCopied] = useState(false)

  /**
   * 클립보드 복사 핸들러.
   * Clipboard API를 우선 시도하고, 미지원 환경에서는 execCommand로 폴백합니다.
   */
  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    // 부모 TableRow의 onClick(행 이동) 이벤트 전파 차단
    event.stopPropagation()

    if (!text) {
      toast.error("복사할 링크가 없습니다.")
      return
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // HTTPS 또는 localhost에서 사용 가능한 Clipboard API
        await navigator.clipboard.writeText(text)
      } else {
        // HTTP 환경 폴백 — textarea + execCommand
        fallbackCopyToClipboard(text)
      }

      // 성공 피드백
      setCopied(true)
      toast.success("링크가 복사되었습니다.", {
        description: text,
        duration: 2000,
      })

      // 1.5초 후 원래 아이콘으로 복원
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("링크 복사에 실패했습니다.", {
        description: "수동으로 링크를 복사해 주세요.",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label={ariaLabel}
      title={copied ? "복사됨!" : "링크 복사"}
      className="transition-colors"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}

/**
 * Clipboard API를 사용할 수 없는 환경에서의 폴백 복사 함수.
 * textarea 엘리먼트를 임시 생성하여 execCommand로 복사합니다.
 */
function fallbackCopyToClipboard(text: string): void {
  const textarea = document.createElement("textarea")
  textarea.value = text
  // 화면에 보이지 않도록 스타일 설정
  textarea.style.position = "fixed"
  textarea.style.top = "0"
  textarea.style.left = "0"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logError } from "@/lib/utils/logger"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 구조화된 에러 로깅 — 프로덕션에서는 Sentry 등 외부 서비스로 교체
    logError("app/error", error, {
      digest: error.digest,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    })
  }, [error])

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-semibold">오류가 발생했습니다</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "예기치 않은 오류가 발생했습니다. 다시 시도해주세요."}
          </p>
          {/* 에러 식별자 — 지원 문의 시 유용 */}
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 mt-1">
              오류 코드: {error.digest}
            </p>
          )}
        </div>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  )
}

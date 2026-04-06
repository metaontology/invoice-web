"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** 상태 필터 옵션 ("all" = 전체, 빈 문자열 값 불가) */
const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기" },
  { value: "approved", label: "승인" },
  { value: "rejected", label: "거절" },
] as const

/**
 * 견적서 목록 필터 패널 컴포넌트
 * 상태별 필터링 및 날짜 범위 필터링 제공
 * URL searchParams 기반으로 상태 유지
 */
export function FilterPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") ?? "all"
  const currentFrom = searchParams.get("from") ?? ""
  const currentTo = searchParams.get("to") ?? ""

  /**
   * 특정 searchParam 키를 업데이트하는 헬퍼
   * 기존 파라미터는 유지하고 page는 1로 초기화합니다.
   */
  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // 필터 변경 시 첫 페이지로 초기화
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  /**
   * 모든 필터를 초기화합니다.
   * q, status, from, to, page 파라미터를 제거합니다.
   */
  function handleReset() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.delete("status")
    params.delete("from")
    params.delete("to")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  /** 활성화된 필터가 하나라도 있는지 확인 */
  const hasActiveFilter =
    searchParams.has("q") ||
    searchParams.has("status") ||
    searchParams.has("from") ||
    searchParams.has("to")

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 상태 필터 */}
      <Select
        value={currentStatus}
        onValueChange={(value) => updateParam("status", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-28" aria-label="상태 필터">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 날짜 범위 시작 */}
      <div className="flex items-center gap-1">
        <Input
          type="date"
          value={currentFrom}
          onChange={(e) => updateParam("from", e.target.value)}
          className="w-36 text-sm"
          aria-label="발행일 시작"
          title="발행일 시작"
        />
        <span className="text-muted-foreground text-sm">~</span>
        {/* 날짜 범위 끝 */}
        <Input
          type="date"
          value={currentTo}
          min={currentFrom || undefined}
          onChange={(e) => updateParam("to", e.target.value)}
          className="w-36 text-sm"
          aria-label="발행일 끝"
          title="발행일 끝"
        />
      </div>

      {/* 초기화 버튼 (활성 필터가 있을 때만 표시) */}
      {hasActiveFilter && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
          초기화
        </Button>
      )}
    </div>
  )
}

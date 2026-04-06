"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useDebounceCallback } from "usehooks-ts"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/**
 * 견적서 목록 검색 바 컴포넌트
 * 클라이언트명 또는 견적서 번호로 실시간 검색 (300ms 디바운싱)
 * URL searchParams 기반으로 상태 유지 (북마크/공유 가능)
 */
export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 입력 상태는 로컬에서 관리하고 URL은 디바운싱 후 업데이트
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "")

  /**
   * URL searchParams에서 q 파라미터를 업데이트합니다.
   * 기존 파라미터는 유지하고 page는 1로 초기화합니다.
   */
  const updateUrl = useDebounceCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value.trim()) {
      params.set("q", value.trim())
    } else {
      params.delete("q")
    }
    // 검색어 변경 시 첫 페이지로 초기화
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }, 300)

  /**
   * 검색어 입력 핸들러
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)
    updateUrl(value)
  }

  /**
   * 검색어 초기화 핸들러
   */
  function handleClear() {
    setInputValue("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative flex items-center">
      {/* 검색 아이콘 */}
      <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />

      <Input
        type="text"
        placeholder="클라이언트명 또는 견적서 번호 검색..."
        value={inputValue}
        onChange={handleChange}
        className="pl-8 pr-8"
        aria-label="견적서 검색"
      />

      {/* 초기화 버튼 (입력값이 있을 때만 표시) */}
      {inputValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 size-7 p-0 hover:bg-transparent"
          onClick={handleClear}
          aria-label="검색어 초기화"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

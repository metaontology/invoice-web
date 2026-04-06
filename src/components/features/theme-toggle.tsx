"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useIsClient } from "usehooks-ts"

/** 다크/라이트 테마 토글 버튼 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isClient = useIsClient()

  // 서버/클라이언트 하이드레이션 불일치 방지
  if (!isClient) return <Button variant="ghost" size="icon" disabled />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 전환</span>
    </Button>
  )
}

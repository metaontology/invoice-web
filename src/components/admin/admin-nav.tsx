/**
 * 관리자 네비게이션 바 컴포넌트
 * 로고, 네비게이션 링크, 로그아웃 버튼을 포함합니다.
 */

import Link from "next/link"
import { FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"

export function AdminNav() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 / 타이틀 */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin/invoices"
            className="flex items-center gap-2 font-semibold text-foreground hover:text-foreground/80"
          >
            <FileText className="h-5 w-5" />
            <span>Invoice 관리자</span>
          </Link>

          {/* 네비게이션 링크 */}
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/invoices"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              견적서 목록
            </Link>
          </nav>
        </div>

        {/* 로그아웃 버튼 */}
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </Button>
        </form>
      </div>
    </header>
  )
}

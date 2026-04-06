/**
 * 관리자 레이아웃
 * /admin/* 경로에 공통으로 적용되는 레이아웃입니다.
 * AdminNav 네비게이션 바를 포함합니다.
 */

import { AdminNav } from "@/components/admin/admin-nav"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout

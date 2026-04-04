import Link from "next/link"
import { ThemeToggle } from "@/components/features/theme-toggle"
import { siteConfig } from "@/lib/constants/site"

/** 공개 페이지 헤더 (Server Component) */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-4xl">
        <Link href="/" className="font-semibold text-foreground">
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

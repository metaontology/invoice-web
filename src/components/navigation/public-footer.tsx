import { siteConfig } from "@/lib/constants/site"

/** 공개 페이지 푸터 (Server Component) */
export function PublicFooter() {
  return (
    <footer className="border-t py-6">
      <div className="container flex items-center justify-center px-4 mx-auto max-w-4xl text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}

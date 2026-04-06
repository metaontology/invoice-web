import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/** Noto Sans KR 로컬 폰트 등록 */
const notoSansKR = localFont({
  src: "../../public/fonts/NotoSansKR-Regular.ttf",
  variable: "--font-noto-sans-kr",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "견적서",
    template: "%s | 견적서",
  },
  description: "노션 기반 견적서 관리 시스템",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable}`}
    >
      <body>
        <Providers>
          {children}
          <Toaster richColors theme="system" position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}

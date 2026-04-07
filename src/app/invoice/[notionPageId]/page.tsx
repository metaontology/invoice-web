import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getInvoice } from "@/lib/services/invoice.service"
import { siteConfig } from "@/lib/constants/site"
import { InvoiceHeader } from "@/components/invoice/invoice-header"
import { InvoiceClientSection } from "@/components/invoice/invoice-client-section"
import { InvoiceItemsTable } from "@/components/invoice/invoice-items-table"
import { InvoiceTotals } from "@/components/invoice/invoice-totals"
import { InvoicePdfButton } from "@/components/invoice/invoice-pdf-button"

interface InvoicePageProps {
  params: Promise<{ notionPageId: string }>
}

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { notionPageId } = await params

  // 실제 견적서 데이터로 메타데이터 생성 — null이면 기본 title 반환
  const invoice = await getInvoice(notionPageId)
  if (!invoice) {
    return { title: "견적서" }
  }

  // 환경 변수 우선, 없으면 siteConfig.url 사용
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url
  const invoiceUrl = `${baseUrl}/invoice/${notionPageId}`
  const title = `${invoice.invoice_code} | 견적서`
  const description = `${invoice.client_name} 견적서 — ${invoice.invoice_code}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: invoiceUrl,
      siteName: siteConfig.name,
      type: "website",
    },
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { notionPageId } = await params

  // Notion API로 견적서 조회 — 존재하지 않으면 404
  const invoice = await getInvoice(notionPageId)
  if (!invoice) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-8">
          {/* 견적서 헤더 — 코드, 발행일, 유효기간, 상태 */}
          <InvoiceHeader
            invoice_code={invoice.invoice_code}
            issued_at={invoice.issued_at}
            expires_at={invoice.expires_at}
            status={invoice.status}
          />

          {/* 고객사 정보 섹션 */}
          <InvoiceClientSection client_name={invoice.client_name} />

          {/* 견적 항목 테이블 */}
          <InvoiceItemsTable items={invoice.items} />

          {/* 합계 금액 */}
          <InvoiceTotals total_amount={invoice.total_amount} />

          {/* PDF 다운로드 버튼 — 우측 정렬 */}
          <div className="flex justify-end">
            <InvoicePdfButton notionPageId={notionPageId} />
          </div>
        </div>
      </div>
    </div>
  )
}

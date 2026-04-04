import { notFound } from "next/navigation"
import { FileText } from "lucide-react"
import type { Metadata } from "next"

interface InvoicePageProps {
  params: Promise<{ notionPageId: string }>
}

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { notionPageId } = await params
  return {
    title: `견적서 ${notionPageId}`,
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { notionPageId } = await params

  // TODO: Notion API 연동 후 실제 데이터로 교체
  // const invoice = await getInvoice(notionPageId)
  // if (!invoice) notFound()

  // 개발 중: notionPageId가 없으면 404
  if (!notionPageId) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 견적서 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold">견적서</h1>
          </div>
          {/* TODO: PDF 다운로드 버튼 구현 */}
          <button
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            disabled
          >
            PDF 다운로드 (준비 중)
          </button>
        </div>

        {/* 견적서 본문 — Notion API 연동 후 실제 데이터 표시 */}
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <div className="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground">
            <FileText className="size-12 opacity-40" />
            <p className="text-sm">
              견적서 ID: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{notionPageId}</code>
            </p>
            <p className="text-xs">Notion API 연동 후 견적서 내용이 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

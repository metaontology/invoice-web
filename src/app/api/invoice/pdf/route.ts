// API Route: 견적서 PDF 생성 및 반환 (GET)
import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { createElement } from "react"
import { getInvoice } from "@/lib/services/invoice.service"
import { InvoicePDF } from "@/components/pdf/invoice-pdf"

// 매 요청마다 PDF를 새로 생성 (캐시 비활성화)
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // id 파라미터 필수 검증
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { error: "id 파라미터가 필요합니다." },
        { status: 400 }
      )
    }

    // Notion API로 견적서 조회
    const invoice = await getInvoice(id)
    if (!invoice) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // PDF 버퍼 생성 — renderToBuffer 타입 캐스팅 (as any) 필요
    const buffer = await (renderToBuffer as any)(
      createElement(InvoicePDF, { invoice })
    )

    // Buffer → Uint8Array 변환 (Next.js Response 호환)
    const uint8Array = new Uint8Array(buffer)

    const fileName = `${invoice.invoice_code}-견적서.pdf`

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Content-Length": uint8Array.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("[PDF 생성 오류]", error)
    return NextResponse.json(
      { error: "PDF 생성에 실패했습니다." },
      { status: 500 }
    )
  }
}

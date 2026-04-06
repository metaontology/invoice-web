import type { Invoice } from "@/types/invoice"

/** PDF 렌더링 컴포넌트 props */
export interface InvoicePDFProps {
  /** 견적서 데이터 */
  data: Invoice
}

/** PDF 생성 API 요청 */
export interface PDFGenerateRequest {
  /** 견적서 ID (Notion 페이지 ID) */
  invoiceId: string
}

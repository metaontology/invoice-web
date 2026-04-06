/** 견적서 상태 타입 */
export type InvoiceStatus = "pending" | "rejected" | "approved"

/** 발행사(회사) 정보 */
export interface CompanyInfo {
  /** 회사명 */
  name: string
  /** 주소 */
  address?: string
  /** 전화번호 */
  phone?: string
  /** 이메일 */
  email?: string
  /** 사업자 등록번호 */
  businessNumber?: string
}

/** 견적서 항목 */
export interface InvoiceItem {
  /** 항목 ID (Notion 페이지 ID) */
  id: string
  /** 항목 코드 */
  item_code: string
  /** 항목명 */
  item_name: string
  /** 수량 */
  quantity: number
  /** 단가 */
  unit_price: number
  /** 금액 (수량 × 단가) */
  amount: number
}

/** 견적서 */
export interface Invoice {
  /** 견적서 ID (Notion 페이지 ID) */
  id: string
  /** 견적서 코드 */
  invoice_code: string
  /** 고객사명 */
  client_name: string
  /** 발행일 */
  issued_at: string
  /** 유효기간 */
  expires_at: string
  /** 상태 */
  status: InvoiceStatus
  /** 합계 금액 */
  total_amount: number
  /** 견적 항목 목록 */
  items: InvoiceItem[]
  /** 발행사 정보 */
  company?: CompanyInfo
}

/** 견적서 조회 에러 */
export interface InvoiceError {
  /** 에러 코드 */
  code: "NOT_FOUND" | "API_ERROR" | "INVALID_ID"
  /** 에러 메시지 */
  message: string
}

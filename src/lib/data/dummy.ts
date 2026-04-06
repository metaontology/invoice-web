import type { Invoice } from "@/types/invoice"

/**
 * UI 개발 및 테스트용 더미 견적서 데이터
 * CSV 원본 데이터 기반으로 구성
 */
export const DUMMY_INVOICE: Invoice = {
  id: "dummy-invoice-001",
  invoice_code: "INV-2025-001",
  client_name: "ABC",
  issued_at: "2025-10-01",
  expires_at: "2025-10-07",
  status: "pending",
  total_amount: 5000000,
  items: [
    {
      id: "dummy-item-001",
      item_code: "DESIGN-001",
      item_name: "웹사이트 디자인",
      quantity: 1,
      unit_price: 3000000,
      amount: 3000000,
    },
    {
      id: "dummy-item-002",
      item_code: "DESIGN-002",
      item_name: "로고디자인",
      quantity: 2,
      unit_price: 500000,
      amount: 1000000,
    },
    {
      id: "dummy-item-003",
      item_code: "DEGISN-003",
      item_name: "명함 디자인",
      quantity: 100,
      unit_price: 10000,
      amount: 1000000,
    },
  ],
  company: {
    name: "디자인 스튜디오",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "hello@designstudio.kr",
    businessNumber: "123-45-67890",
  },
}

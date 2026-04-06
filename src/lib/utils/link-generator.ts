/**
 * 견적서 고유 URL을 생성합니다.
 *
 * @param invoiceId - 견적서 Notion 페이지 ID
 * @returns 견적서 공개 URL (예: https://example.com/invoice/abc123)
 *
 * 우선순위:
 * 1. NEXT_PUBLIC_APP_URL 환경 변수
 * 2. 브라우저 window.location.origin (CSR 환경)
 * 3. 빈 문자열 (SSR 환경에서 환경 변수 미설정 시)
 */
export function generateInvoiceUrl(invoiceId: string): string {
  // 환경 변수가 설정된 경우 우선 사용
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}`
  }

  // 브라우저 환경에서는 현재 오리진 사용
  if (typeof window !== "undefined") {
    return `${window.location.origin}/invoice/${invoiceId}`
  }

  // SSR 환경에서 환경 변수 미설정 시 빈 문자열 반환
  return ""
}

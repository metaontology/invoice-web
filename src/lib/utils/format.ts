/**
 * 숫자를 한국 원화 통화 형식으로 변환합니다.
 * 서버/클라이언트 모두 사용 가능한 순수 유틸리티 함수
 *
 * @param amount - 변환할 금액 (숫자)
 * @returns 원화 통화 형식 문자열 (예: ₩5,000,000)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount)
}

/**
 * 날짜 문자열을 한국어 형식으로 변환합니다.
 * 서버/클라이언트 모두 사용 가능한 순수 유틸리티 함수
 *
 * @param dateStr - 변환할 날짜 문자열 (예: '2025-10-01')
 * @returns 한국어 날짜 형식 문자열 (예: 2025년 10월 1일)
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

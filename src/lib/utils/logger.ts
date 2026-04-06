/**
 * 구조화된 로깅 유틸리티
 * timestamp, context, message, meta 형태로 일관된 로그를 출력합니다.
 */

/** 구조화된 로그 항목 타입 */
interface LogEntry {
  timestamp: string
  context: string
  message: string
  meta?: Record<string, unknown>
}

/**
 * 에러를 구조화된 형태로 콘솔에 출력합니다.
 * @param context - 오류 발생 위치 또는 작업명 (예: "getInvoice", "pdf-generation")
 * @param error - 발생한 오류 객체
 * @param meta - 추가 컨텍스트 정보 (선택)
 */
export function logError(
  context: string,
  error: unknown,
  meta?: Record<string, unknown>
): void {
  const message =
    error instanceof Error ? error.message : String(error)

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    context,
    message,
    ...(meta ? { meta } : {}),
  }

  console.error("[ERROR]", JSON.stringify(entry, null, 2))
}

/**
 * 정보성 로그를 구조화된 형태로 콘솔에 출력합니다.
 * @param context - 로그 발생 위치 또는 작업명
 * @param message - 로그 메시지
 * @param meta - 추가 컨텍스트 정보 (선택)
 */
export function logInfo(
  context: string,
  message: string,
  meta?: Record<string, unknown>
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    context,
    message,
    ...(meta ? { meta } : {}),
  }

  console.log("[INFO]", JSON.stringify(entry, null, 2))
}

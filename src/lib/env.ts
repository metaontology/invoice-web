/**
 * 환경변수 검증 모듈
 * 서버 시작 시 필수 환경변수 존재 여부를 확인하여 명확한 오류를 제공합니다.
 */

/** 서버 전용 필수 환경변수 목록 */
const REQUIRED_SERVER_ENV_VARS = [
  "NOTION_API_KEY",
  "NOTION_INVOICES_DATABASE_ID",
  "NOTION_ITEMS_DATABASE_ID",
] as const

/** 환경변수 유효성 검사 — 누락된 변수가 있으면 오류를 throw */
export function validateEnv(): void {
  const missing = REQUIRED_SERVER_ENV_VARS.filter(
    (key) => !process.env[key]
  )

  if (missing.length > 0) {
    throw new Error(
      `[환경변수 오류] 필수 환경변수가 설정되지 않았습니다:\n` +
        missing.map((key) => `  - ${key}`).join("\n") +
        `\n\n.env.local 파일을 확인하거나 배포 환경 변수를 설정해주세요.`
    )
  }
}

/**
 * 세션 관리 모듈
 * 서버 메모리(Set)에 세션 토큰을 저장하고 쿠키로 클라이언트에 전달합니다.
 *
 * ⚠️ 주의: in-memory 세션은 서버 재시작 시 초기화됩니다.
 * Vercel serverless 환경에서는 인스턴스별 메모리가 분리되므로
 * 프로덕션 확장이 필요한 경우 Redis, KV 등 외부 스토리지 사용을 권장합니다.
 */

import { cookies } from "next/headers"

/** 세션 쿠키 이름 */
export const SESSION_COOKIE_NAME = "admin_session"

/** 유효한 세션 토큰 저장소 (module-level 싱글턴) */
const sessionTokens = new Set<string>()

/**
 * 새 세션을 생성하고 쿠키를 설정합니다.
 * 랜덤 UUID를 토큰으로 사용하며 HttpOnly 쿠키로 저장합니다.
 */
export async function createSession(): Promise<void> {
  const token = crypto.randomUUID()
  sessionTokens.add(token)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 8시간 유효
    maxAge: 60 * 60 * 8,
  })
}

/**
 * 현재 요청의 세션이 유효한지 검증합니다.
 * 쿠키에서 토큰을 읽어 서버 메모리의 Set에 존재하는지 확인합니다.
 */
export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return false
  return sessionTokens.has(token)
}

/**
 * 현재 세션을 무효화하고 쿠키를 삭제합니다.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    sessionTokens.delete(token)
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

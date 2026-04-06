/**
 * Next.js Middleware — Rate Limiting
 *
 * /api/invoice/pdf 경로에 IP 기반 분당 10회 요청 제한을 적용합니다.
 *
 * ⚠️ 주의: 이 in-memory rate limit은 Node.js 프로세스 메모리에 저장됩니다.
 * Vercel serverless 환경에서는 인스턴스별로 별도의 메모리를 사용하므로
 * 실제 제한 효과가 제한적입니다. 프로덕션에서는 Redis, Upstash 등
 * 외부 공유 스토리지 기반 rate limiter 사용을 권장합니다.
 */

import { NextRequest, NextResponse } from "next/server"

/** rate limit 설정 */
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1분

interface RateLimitEntry {
  count: number
  resetAt: number
}

/** IP별 요청 카운트 저장소 */
const requestCounts = new Map<string, RateLimitEntry>()

/** 만료된 항목 정리 (메모리 누수 방지) */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [ip, entry] of requestCounts.entries()) {
    if (now >= entry.resetAt) {
      requestCounts.delete(ip)
    }
  }
}

export function middleware(request: NextRequest): NextResponse {
  // X-Forwarded-For 헤더에서 클라이언트 IP 추출
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  const now = Date.now()

  // 주기적으로 만료 항목 정리 (매 요청마다 실행하지 않고 확률적으로)
  if (Math.random() < 0.1) {
    cleanupExpiredEntries()
  }

  const existing = requestCounts.get(ip)

  if (!existing || now >= existing.resetAt) {
    // 새 윈도우 시작
    requestCounts.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return NextResponse.next()
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    // rate limit 초과
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000)

    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: `요청 한도를 초과했습니다. ${retryAfterSeconds}초 후 다시 시도해주세요.`,
        retryAfter: retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(existing.resetAt / 1000)),
        },
      }
    )
  }

  // 카운트 증가
  requestCounts.set(ip, {
    count: existing.count + 1,
    resetAt: existing.resetAt,
  })

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/invoice/pdf"],
}

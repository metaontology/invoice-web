/**
 * Next.js Middleware — Rate Limiting + 관리자 인증
 *
 * 1. /api/invoice/pdf 경로에 IP 기반 분당 10회 요청 제한 적용
 * 2. /admin/* 경로에 세션 쿠키 기반 인증 검사 적용
 *    - /admin/login은 인증 검사 생략 (로그인 페이지 자체)
 *    - 세션 쿠키가 없으면 /admin/login으로 리다이렉트
 *
 * ⚠️ Middleware는 Edge Runtime에서 실행되므로 cookies() API 대신
 *    request.cookies.get()으로 쿠키를 읽습니다.
 *    세션 토큰 Set은 Node.js 런타임에 존재하므로 Edge에서 접근 불가 —
 *    쿠키 존재 여부만으로 1차 인증을 수행합니다.
 *
 * ⚠️ in-memory rate limit은 Vercel serverless 환경에서 인스턴스별로
 *    별도의 메모리를 사용하므로 실제 제한 효과가 제한적입니다.
 *    프로덕션에서는 Redis, Upstash 등 외부 공유 스토리지 기반 rate limiter
 *    사용을 권장합니다.
 */

import { NextRequest, NextResponse } from "next/server"

/** 세션 쿠키 이름 (session.ts와 동일한 값 사용 — Edge Runtime에서 import 불가) */
const SESSION_COOKIE_NAME = "admin_session"

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

/**
 * Rate Limit 검사
 * 제한 초과 시 429 응답을 반환하고, 통과 시 null을 반환합니다.
 */
function checkRateLimit(ip: string): NextResponse | null {
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
    return null
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

  return null
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // X-Forwarded-For 헤더에서 클라이언트 IP 추출
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  // PDF API rate limiting 검사
  if (pathname.startsWith("/api/invoice/pdf")) {
    const rateLimitResponse = checkRateLimit(ip)
    if (rateLimitResponse) return rateLimitResponse
    return NextResponse.next()
  }

  // 관리자 경로 인증 검사
  if (pathname.startsWith("/admin")) {
    // 로그인 페이지 자체는 인증 없이 접근 허용
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    // 세션 쿠키 존재 여부 확인 (Edge Runtime에서는 쿠키 존재 여부만 검사)
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      // 인증 쿠키 없음 → 로그인 페이지로 리다이렉트
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/invoice/pdf", "/admin", "/admin/:path*"],
}

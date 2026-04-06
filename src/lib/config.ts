/**
 * 환경별 설정 상수
 */

/** 현재 개발 환경 여부 */
export const isDev = process.env.NODE_ENV === "development"

/**
 * 캐시 TTL (초 단위)
 * - 개발: 60초 (빠른 반영)
 * - 프로덕션: 300초 (5분)
 */
export const CACHE_TTL = isDev ? 60 : 300

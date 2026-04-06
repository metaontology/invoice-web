import { Client } from "@notionhq/client"
import { validateEnv } from "@/lib/env"

/**
 * Notion API 클라이언트 싱글턴
 * 서버 사이드에서만 사용 (NOTION_API_KEY는 서버 전용 환경 변수)
 * 초기화 전 필수 환경변수 유효성 검사를 수행합니다.
 */
validateEnv()

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

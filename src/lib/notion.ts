import { Client } from "@notionhq/client"
import { validateEnv } from "@/lib/env"

/**
 * Notion API 클라이언트 lazy 싱글턴
 * 빌드 타임이 아닌 첫 번째 실제 요청 시점에 초기화됩니다.
 */
let _notion: Client | null = null

export function getNotionClient(): Client {
  if (!_notion) {
    validateEnv()
    _notion = new Client({ auth: process.env.NOTION_API_KEY })
  }
  return _notion
}

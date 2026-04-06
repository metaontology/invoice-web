import { unstable_cache } from "next/cache"
import { APIResponseError } from "@notionhq/client"
import type { Invoice } from "@/types/invoice"
import type { NotionPage } from "@/types/notion"
import { notion } from "@/lib/notion"
import { parseInvoicePage, parseItemPage } from "@/lib/utils/notion-parser"
import { CACHE_TTL } from "@/lib/config"

/**
 * Notion 페이지 ID로 견적서 데이터를 조회합니다. (내부 함수)
 *
 * @param notionPageId - Notion 견적서 페이지 ID
 * @returns Invoice 객체, 페이지가 존재하지 않으면 null
 * @throws 404/400(validation) 외 Notion API 오류는 상위로 전파
 */
async function getInvoiceRaw(notionPageId: string): Promise<Invoice | null> {
  try {
    // 견적서 기본 정보 조회
    const page = await notion.pages.retrieve({ page_id: notionPageId })

    // 연결된 항목 조회 (Items DB에서 invoice Relation 역방향 필터링)
    // @notionhq/client v5: databases.query → dataSources.query, database_id → data_source_id
    const itemsResult = await notion.dataSources.query({
      data_source_id: process.env.NOTION_ITEMS_DATABASE_ID!,
      filter: {
        property: "Invoice",
        relation: { contains: notionPageId },
      },
    })

    // 각 항목 페이지를 InvoiceItem으로 변환 (page 타입 결과만 필터링)
    const items = itemsResult.results
      .filter((p): p is (typeof p & { object: "page" }) => p.object === "page")
      .map((p) => parseItemPage(p as NotionPage))

    // 견적서 페이지를 Invoice로 변환하여 반환
    return parseInvoicePage(page as NotionPage, items)
  } catch (error) {
    if (error instanceof APIResponseError) {
      // 404: 페이지 없음, 400 validation_error: UUID 형식 오류 → 모두 null 반환 (not-found 처리)
      if (error.status === 404 || (error.status === 400 && error.code === "validation_error")) {
        return null
      }
    }

    // 그 외 오류는 상위로 전파 (app/error.tsx 에러 경계에서 처리)
    throw error
  }
}

/**
 * Notion 페이지 ID로 견적서 데이터를 조회합니다. (캐시 적용)
 *
 * 동일 pageId 반복 호출 시 캐시된 결과를 반환하여 Notion API 호출을 최소화합니다.
 * - 개발: TTL 60초
 * - 프로덕션: TTL 300초
 */
export const getInvoice = unstable_cache(getInvoiceRaw, ["invoice"], {
  revalidate: CACHE_TTL,
  tags: ["invoice"],
})

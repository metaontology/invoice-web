import type {
  NotionPage,
  NotionPropertyTitle,
  NotionPropertyRichText,
  NotionPropertyNumber,
  NotionPropertyDate,
  NotionPropertySelect,
  NotionPropertyFormula,
} from "@/types/notion"
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/types/invoice"

/**
 * Notion 프로퍼티에서 title 텍스트 추출
 */
function getTitleText(prop: NotionPropertyTitle): string {
  return prop.title[0]?.plain_text ?? ""
}

/**
 * Notion 프로퍼티에서 rich_text 텍스트 추출
 */
function getRichText(prop: NotionPropertyRichText): string {
  return prop.rich_text[0]?.plain_text ?? ""
}

/**
 * Notion 프로퍼티에서 number 값 추출 (null이면 0 반환)
 */
function getNumber(prop: NotionPropertyNumber): number {
  return prop.number ?? 0
}

/**
 * Notion 프로퍼티에서 date.start 텍스트 추출 (null이면 빈 문자열 반환)
 */
function getDateStart(prop: NotionPropertyDate): string {
  return prop.date?.start ?? ""
}

/**
 * Notion 프로퍼티에서 select.name 텍스트 추출 (null이면 빈 문자열 반환)
 */
function getSelectName(prop: NotionPropertySelect): string {
  return prop.select?.name ?? ""
}

/**
 * Notion 프로퍼티에서 formula.number 값 추출
 * formula.type이 'number'인 경우만 값 반환, 그 외에는 0 반환
 */
function getFormulaNumber(prop: NotionPropertyFormula): number {
  if (prop.formula.type === "number") {
    return prop.formula.number ?? 0
  }
  return 0
}

/**
 * Notion Items DB 페이지를 InvoiceItem 타입으로 변환
 *
 * Items DB 프로퍼티:
 * - item_code: Title
 * - item_name: Text (rich_text)
 * - quantity: Number
 * - unit_price: Number
 * - amount: Formula (단가×수량)
 */
export function parseItemPage(page: NotionPage): InvoiceItem {
  const props = page.properties

  return {
    id: page.id,
    item_code: getTitleText(props["item_code"] as NotionPropertyTitle),
    item_name: getRichText(props["item_name"] as NotionPropertyRichText),
    quantity: getNumber(props["quantity"] as NotionPropertyNumber),
    unit_price: getNumber(props["unit_price"] as NotionPropertyNumber),
    amount: getFormulaNumber(props["amount"] as NotionPropertyFormula),
  }
}

/**
 * Notion Invoices DB 페이지를 Invoice 타입으로 변환
 *
 * Invoices DB 프로퍼티:
 * - invoice_code: Title
 * - client_name: Text (rich_text)
 * - issued_at: Date
 * - expires_at: Date (null이면 빈 문자열)
 * - status: Select (pending|rejected|approved)
 * - total_amount: Number
 */
export function parseInvoicePage(page: NotionPage, items: InvoiceItem[]): Invoice {
  const props = page.properties

  return {
    id: page.id,
    invoice_code: getTitleText(props["invoice_code"] as NotionPropertyTitle),
    client_name: getRichText(props["client_name"] as NotionPropertyRichText),
    issued_at: getDateStart(props["issued_at"] as NotionPropertyDate),
    expires_at: getDateStart(props["expires_at"] as NotionPropertyDate),
    status: getSelectName(props["status"] as NotionPropertySelect) as InvoiceStatus,
    total_amount: getNumber(props["total_amount"] as NotionPropertyNumber),
    items,
  }
}

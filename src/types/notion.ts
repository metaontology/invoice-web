/** Notion 텍스트 콘텐츠 */
export interface NotionTextContent {
  /** 순수 텍스트 */
  plain_text: string
  /** 링크 URL */
  href?: string | null
}

/** Notion 리치 텍스트 */
export interface NotionRichText {
  type: "text"
  text: NotionTextContent
  plain_text: string
}

/** Notion 셀렉트 옵션 */
export interface NotionSelectOption {
  id: string
  name: string
  color: string
}

/** Notion 프로퍼티 값 — title */
export interface NotionPropertyTitle {
  type: "title"
  title: NotionRichText[]
}

/** Notion 프로퍼티 값 — rich_text */
export interface NotionPropertyRichText {
  type: "rich_text"
  rich_text: NotionRichText[]
}

/** Notion 프로퍼티 값 — number */
export interface NotionPropertyNumber {
  type: "number"
  number: number | null
}

/** Notion 프로퍼티 값 — date */
export interface NotionPropertyDate {
  type: "date"
  date: { start: string; end?: string | null } | null
}

/** Notion 프로퍼티 값 — select */
export interface NotionPropertySelect {
  type: "select"
  select: NotionSelectOption | null
}

/** Notion 프로퍼티 값 — relation */
export interface NotionPropertyRelation {
  type: "relation"
  relation: Array<{ id: string }>
  has_more?: boolean
}

/** Notion 프로퍼티 값 — formula */
export interface NotionPropertyFormula {
  type: "formula"
  formula:
    | { type: "string"; string: string | null }
    | { type: "number"; number: number | null }
    | { type: "boolean"; boolean: boolean | null }
}

/** Notion 프로퍼티 값 유니언 타입 */
export type NotionPropertyValue =
  | NotionPropertyTitle
  | NotionPropertyRichText
  | NotionPropertyNumber
  | NotionPropertyDate
  | NotionPropertySelect
  | NotionPropertyRelation
  | NotionPropertyFormula

/** Notion 페이지 프로퍼티 맵 */
export type NotionProperties = Record<string, NotionPropertyValue>

/** Notion 페이지 */
export interface NotionPage {
  id: string
  properties: NotionProperties
  created_time: string
  last_edited_time: string
}

/** Notion 데이터베이스 쿼리 결과 */
export interface NotionDatabaseQueryResult {
  results: NotionPage[]
  has_more: boolean
  next_cursor: string | null
}

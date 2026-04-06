---
name: "@notionhq/client v5 Breaking Change — dataSources.query"
description: v5에서 databases.query가 dataSources.query로 변경됨, database_id → data_source_id
type: feedback
---

`@notionhq/client` v5 (현재 설치: 5.16.0)에서 `databases.query`가 제거되었다.

- `notion.databases.query({ database_id: ... })` → ❌ 존재하지 않음
- `notion.dataSources.query({ data_source_id: ... })` → ✅ 올바른 패턴

**Why:** v5 Breaking Change — Notion API가 "database"를 "data source"로 재명명했고, 클라이언트 SDK도 그에 맞게 변경됨.

**How to apply:** DB 쿼리 코드 작성 시 반드시 `dataSources.query`와 `data_source_id` 파라미터 사용. 응답 타입도 `QueryDataSourceResponse`로 변경되었으며, `results`에 `PageObjectResponse | PartialPageObjectResponse | DataSourceObjectResponse` 등이 포함될 수 있으므로 `p.object === "page"` 필터링 필요.

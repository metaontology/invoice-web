// 견적서 PDF 템플릿 컴포넌트 (@react-pdf/renderer 기반)
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer"
import path from "path"
import type { Invoice, InvoiceStatus } from "@/types/invoice"
import { formatCurrency, formatDate } from "@/lib/utils/format"

// 한글 폰트 등록 — .ttf/.otf만 허용 (.woff2 금지)
Font.register({
  family: "NotoSansKR",
  src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf"),
})

/** 상태별 한국어 레이블 */
const statusLabelMap: Record<InvoiceStatus, string> = {
  pending: "검토중",
  approved: "승인됨",
  rejected: "반려됨",
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    padding: 48,
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  /* 헤더 섹션 */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: "NotoSansKR",
    color: "#111827",
    marginBottom: 4,
  },
  invoiceCode: {
    fontSize: 11,
    color: "#6b7280",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: 4,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
  },
  dateLabel: {
    fontSize: 9,
    color: "#9ca3af",
    width: 42,
    textAlign: "right",
  },
  dateValue: {
    fontSize: 9,
    color: "#374151",
  },
  /* 고객사 섹션 */
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 13,
    color: "#111827",
  },
  /* 발행사 정보 */
  companyRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 2,
  },
  companyLabel: {
    fontSize: 9,
    color: "#9ca3af",
    width: 60,
  },
  companyValue: {
    fontSize: 9,
    color: "#374151",
  },
  /* 테이블 */
  table: {
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  /* 컬럼 너비 */
  colNum: { width: 28, textAlign: "center" },
  colCode: { width: 80, color: "#9ca3af", fontSize: 9 },
  colName: { flex: 1 },
  colQty: { width: 40, textAlign: "right" },
  colPrice: { width: 80, textAlign: "right", color: "#6b7280" },
  colAmount: { width: 88, textAlign: "right" },
  /* 헤더 텍스트 */
  thText: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  /* 행 텍스트 */
  tdText: {
    fontSize: 10,
  },
  tdMuted: {
    fontSize: 9,
    color: "#9ca3af",
  },
  tdBold: {
    fontSize: 10,
    color: "#111827",
  },
  /* 합계 */
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalAmount: {
    fontSize: 18,
    color: "#111827",
  },
})

interface InvoicePDFProps {
  invoice: Invoice
}

/** 견적서 PDF 문서 컴포넌트 */
export function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document
      title={`${invoice.invoice_code} 견적서`}
      author={invoice.company?.name ?? ""}
    >
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>견 적 서</Text>
            <Text style={styles.invoiceCode}>{invoice.invoice_code}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.statusBadge}>
              {statusLabelMap[invoice.status]}
            </Text>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>발행일</Text>
              <Text style={styles.dateValue}>{formatDate(invoice.issued_at)}</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>유효기간</Text>
              <Text style={styles.dateValue}>{formatDate(invoice.expires_at)}</Text>
            </View>
          </View>
        </View>

        {/* 고객사 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>고객사</Text>
          <Text style={styles.sectionValue}>{invoice.client_name}</Text>
        </View>

        {/* 발행사 정보 */}
        {invoice.company && (
          <View style={[styles.section, { marginBottom: 28 }]}>
            <Text style={styles.sectionLabel}>발행사</Text>
            <View style={styles.companyRow}>
              <Text style={styles.companyLabel}>회사명</Text>
              <Text style={styles.companyValue}>{invoice.company.name}</Text>
            </View>
            {invoice.company.address && (
              <View style={styles.companyRow}>
                <Text style={styles.companyLabel}>주소</Text>
                <Text style={styles.companyValue}>{invoice.company.address}</Text>
              </View>
            )}
            {invoice.company.phone && (
              <View style={styles.companyRow}>
                <Text style={styles.companyLabel}>전화</Text>
                <Text style={styles.companyValue}>{invoice.company.phone}</Text>
              </View>
            )}
            {invoice.company.businessNumber && (
              <View style={styles.companyRow}>
                <Text style={styles.companyLabel}>사업자번호</Text>
                <Text style={styles.companyValue}>{invoice.company.businessNumber}</Text>
              </View>
            )}
          </View>
        )}

        {/* 견적 항목 테이블 */}
        <View style={styles.table}>
          {/* 테이블 헤더 */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.colNum]}>#</Text>
            <Text style={[styles.thText, styles.colCode]}>코드</Text>
            <Text style={[styles.thText, styles.colName]}>품명</Text>
            <Text style={[styles.thText, styles.colQty]}>수량</Text>
            <Text style={[styles.thText, styles.colPrice]}>단가</Text>
            <Text style={[styles.thText, styles.colAmount]}>금액</Text>
          </View>
          {/* 테이블 행 */}
          {invoice.items.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tdMuted, styles.colNum]}>{index + 1}</Text>
              <Text style={[styles.tdMuted, styles.colCode]}>{item.item_code}</Text>
              <Text style={[styles.tdText, styles.colName]}>{item.item_name}</Text>
              <Text style={[styles.tdText, styles.colQty]}>
                {item.quantity.toLocaleString("ko-KR")}
              </Text>
              <Text style={[styles.tdMuted, styles.colPrice]}>
                {formatCurrency(item.unit_price)}
              </Text>
              <Text style={[styles.tdBold, styles.colAmount]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* 합계 */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>합계</Text>
          <Text style={styles.totalAmount}>{formatCurrency(invoice.total_amount)}</Text>
        </View>
      </Page>
    </Document>
  )
}

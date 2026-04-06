import { redirect } from "next/navigation"

/** /admin 접근 시 견적서 목록 페이지로 리다이렉트 */
export default function AdminPage() {
  redirect("/admin/invoices")
}

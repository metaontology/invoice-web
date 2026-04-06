"use server"

/**
 * 관리자 인증 Server Actions
 * 로그인 / 로그아웃 처리를 담당합니다.
 */

import { redirect } from "next/navigation"
import { createSession, destroySession } from "@/lib/auth/session"

/**
 * 로그인 처리
 * ADMIN_PASSWORD 환경변수와 입력 비밀번호를 비교하여 세션을 생성합니다.
 *
 * @param formData - 폼 데이터 (password 필드 포함)
 */
export async function login(formData: FormData): Promise<void> {
  const password = formData.get("password") as string
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    redirect("/admin/login?error=invalid")
  }

  await createSession()
  redirect("/admin/invoices")
}

/**
 * 로그아웃 처리
 * 현재 세션을 무효화하고 로그인 페이지로 리다이렉트합니다.
 */
export async function logout(): Promise<void> {
  await destroySession()
  redirect("/admin/login")
}

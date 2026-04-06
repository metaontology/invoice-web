/**
 * 관리자 로그인 페이지
 * ADMIN_PASSWORD 환경변수와 비교하여 인증을 처리합니다.
 * 에러 발생 시 searchParams의 error 파라미터로 메시지를 표시합니다.
 */

import type { Metadata } from "next"
import { FileText } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/auth/actions"

export const metadata: Metadata = {
  title: "관리자 로그인",
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        {/* 로고 영역 */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">Invoice 관리자</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>
              관리자 비밀번호를 입력하여 접속하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 에러 메시지 */}
            {error === "invalid" && (
              <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                비밀번호가 올바르지 않습니다.
              </div>
            )}

            {/* 로그인 폼 */}
            <form action={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="관리자 비밀번호 입력"
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage

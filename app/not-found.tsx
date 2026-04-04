import { FileQuestion } from "lucide-react"
import { EmptyState } from "@/components/page/empty-state"

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <EmptyState
        icon={FileQuestion}
        title="견적서를 찾을 수 없습니다"
        description="요청하신 견적서가 존재하지 않거나 링크가 올바르지 않습니다. 발행자에게 올바른 링크를 요청해주세요."
      />
    </div>
  )
}

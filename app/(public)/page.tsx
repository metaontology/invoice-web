import { FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="rounded-full bg-muted p-4">
          <FileText className="size-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold">견적서 시스템</h1>
          <p className="text-sm text-muted-foreground">
            견적서 링크를 통해 접속해주세요.
            <br />
            예: <code className="text-xs bg-muted px-1 py-0.5 rounded">/invoice/[견적서ID]</code>
          </p>
        </div>
      </div>
    </div>
  )
}

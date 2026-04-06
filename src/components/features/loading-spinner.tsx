import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
}

/** 원형 로딩 스피너 */
export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground",
        sizeMap[size],
        className
      )}
    />
  )
}

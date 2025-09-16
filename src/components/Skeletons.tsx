import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}

export function ToolCardSkeleton() {
  return (
    <div className="glass p-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="flex space-x-1">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  )
}
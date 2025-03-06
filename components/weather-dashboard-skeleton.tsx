import { Skeleton } from "@/components/ui/skeleton"

export function WeatherDashboardSkeleton() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md px-4">
        <div className="flex items-center">
          <Skeleton className="h-8 w-32 bg-white/10" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
          <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
          <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 bg-white/10" />
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-48 w-full rounded-lg bg-white/10" />
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md bg-white/10" />
                ))}
              </div>
              <Skeleton className="mt-6 h-64 w-full rounded-lg bg-white/10" />
            </div>
            <div className="flex flex-col gap-6">
              <Skeleton className="h-48 w-full rounded-lg bg-white/10" />
              <Skeleton className="h-48 w-full rounded-lg bg-white/10" />
              <Skeleton className="h-48 w-full rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


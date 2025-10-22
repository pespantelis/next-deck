import { Suspense } from "react"

import { ListCardSkeleton } from "@/components/list-card"

interface AppLayoutProps {
  overview: React.ReactNode
  environment: React.ReactNode
  domains: React.ReactNode
  volumes: React.ReactNode
}

export default function AppLayout({
  overview,
  environment,
  domains,
  volumes,
}: AppLayoutProps) {
  return (
    <div className="grid gap-4 p-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={4} className="h-17.5" />}>
          {overview}
        </Suspense>
        <Suspense fallback={<ListCardSkeleton count={1} showAction />}>
          {volumes}
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={1} showAction />}>
          {domains}
        </Suspense>
        <Suspense fallback={<ListCardSkeleton count={4} showAction />}>
          {environment}
        </Suspense>
      </div>
    </div>
  )
}

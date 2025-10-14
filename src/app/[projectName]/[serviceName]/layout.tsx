import { Suspense } from "react"

import { ListCardSkeleton } from "@/components/list-card"

interface ServiceLayoutProps {
  environment: React.ReactNode
  domains: React.ReactNode
  volumes: React.ReactNode
}

export default function ServiceLayout({
  environment,
  domains,
  volumes,
}: ServiceLayoutProps) {
  return (
    <div className="grid gap-4 p-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={4} />}>
          {environment}
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={1} />}>{domains}</Suspense>
        <Suspense fallback={<ListCardSkeleton count={1} />}>{volumes}</Suspense>
      </div>
    </div>
  )
}

import { Suspense } from "react"

import { ListCardSkeleton } from "@/components/list-card"

interface PostgresLayoutProps {
  overview: React.ReactNode
  links: React.ReactNode
}

export default function PostgresLayout({
  overview,
  links,
}: PostgresLayoutProps) {
  return (
    <div className="grid gap-4 p-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={4} className="h-17.5" />}>
          {overview}
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={1} showAction />}>
          {links}
        </Suspense>
      </div>
    </div>
  )
}

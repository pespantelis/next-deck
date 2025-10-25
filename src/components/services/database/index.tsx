import { Suspense } from "react"

import { ListCardSkeleton } from "@/components/list-card"
import type { DatabaseType, ServiceIdentifier } from "@/types"

import Links from "./links"
import Overview from "./overview"

interface DatabaseServicesProps extends ServiceIdentifier {
  dbType: DatabaseType
}

export default function DatabaseServices(props: DatabaseServicesProps) {
  return (
    <div className="grid gap-4 p-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={4} className="h-17.5" />}>
          <Overview {...props} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={1} showAction />}>
          <Links {...props} />
        </Suspense>
      </div>
    </div>
  )
}

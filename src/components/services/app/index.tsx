import { Suspense } from "react"

import { ListCardSkeleton } from "@/components/list-card"
import type { ServiceIdentifier } from "@/types"

import Domains from "./domains"
import Environment from "./environment"
import Overview from "./overview"
import Volumes from "./volumes"

export default function AppServices({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  return (
    <div className="grid gap-4 p-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={4} className="h-17.5" />}>
          <Overview projectName={projectName} serviceName={serviceName} />
        </Suspense>
        <Suspense fallback={<ListCardSkeleton count={1} showAction />}>
          <Volumes projectName={projectName} serviceName={serviceName} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ListCardSkeleton count={1} showAction />}>
          <Domains projectName={projectName} serviceName={serviceName} />
        </Suspense>
        <Suspense fallback={<ListCardSkeleton count={4} showAction />}>
          <Environment projectName={projectName} serviceName={serviceName} />
        </Suspense>
      </div>
    </div>
  )
}

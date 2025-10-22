import type { ServiceIdentifier } from "@/types"

import { getOverview } from "./actions"
import { OverviewCard } from "./card"

export default async function Overview({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  const overview = await getOverview(projectName, serviceName)

  return (
    <OverviewCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={overview}
    />
  )
}

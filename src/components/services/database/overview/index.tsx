import type { DatabaseType, ServiceIdentifier } from "@/types"

import { getOverview } from "./actions"
import { OverviewCard } from "./card"

interface DatabaseOverviewProps extends ServiceIdentifier {
  dbType: DatabaseType
}

export default async function Overview({
  projectName,
  serviceName,
  dbType,
}: DatabaseOverviewProps) {
  const overview = await getOverview(projectName, serviceName, dbType)

  return (
    <OverviewCard
      projectName={projectName}
      serviceName={serviceName}
      dbType={dbType}
      initialData={overview}
    />
  )
}

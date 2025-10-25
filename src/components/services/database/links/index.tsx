import type { DatabaseType, ServiceIdentifier } from "@/types"

import { getLinks } from "./actions"
import { LinksCard } from "./card"

interface DatabaseLinksProps extends ServiceIdentifier {
  dbType: DatabaseType
}

export default async function Links({
  projectName,
  serviceName,
  dbType,
}: DatabaseLinksProps) {
  const linksWithStatus = await getLinks(projectName, serviceName, dbType)

  return (
    <LinksCard
      projectName={projectName}
      serviceName={serviceName}
      dbType={dbType}
      initialLinksWithStatus={linksWithStatus}
    />
  )
}

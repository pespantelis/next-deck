import type { ServiceIdentifier } from "@/types"

import { getLinks } from "./actions"
import { LinksCard } from "./card"

export default async function Links({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  const linksWithStatus = await getLinks(projectName, serviceName)

  return (
    <LinksCard
      projectName={projectName}
      serviceName={serviceName}
      initialLinksWithStatus={linksWithStatus}
    />
  )
}

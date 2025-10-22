import type { ServiceIdentifier } from "@/types"

import { getDomains } from "./actions"
import { DomainsCard } from "./card"

export default async function Domains({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  const domains = await getDomains(projectName, serviceName)

  return (
    <DomainsCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={domains}
    />
  )
}

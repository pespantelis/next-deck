import type { ServiceIdentifier } from "@/types"

import { getEnvironmentVariables } from "./actions"
import { EnvironmentCard } from "./card"

export default async function Environment({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  const environment = await getEnvironmentVariables(projectName, serviceName)

  return (
    <EnvironmentCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={environment}
    />
  )
}

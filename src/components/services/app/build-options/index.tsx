import type { ServiceIdentifier } from "@/types"

import { getBuildOptions } from "./actions"
import { BuildOptionsCard } from "./card"

export default async function BuildOptions({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  const buildOptions = await getBuildOptions(projectName, serviceName)

  return (
    <BuildOptionsCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={buildOptions}
    />
  )
}

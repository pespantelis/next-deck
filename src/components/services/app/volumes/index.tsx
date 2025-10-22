import type { ServiceIdentifier } from "@/types"

import { getVolumes } from "./actions"
import { VolumesCard } from "./card"

export default async function Volumes({
  projectName,
  serviceName,
}: ServiceIdentifier) {
  const volumes = await getVolumes(projectName, serviceName)

  return (
    <VolumesCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={volumes}
    />
  )
}

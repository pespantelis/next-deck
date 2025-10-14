import { getVolumes } from "./actions"
import { VolumesListCard } from "./volumes-list-card"

interface VolumesPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default async function VolumesPage({ params }: VolumesPageProps) {
  const { projectName, serviceName } = await params
  const volumes = await getVolumes(projectName, serviceName)

  return (
    <VolumesListCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={volumes}
    />
  )
}

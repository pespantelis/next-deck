import { getOverview } from "./actions"
import { OverviewCard } from "./overview-card"

interface OverviewPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { projectName, serviceName } = await params
  const overview = await getOverview(projectName, serviceName)

  return (
    <OverviewCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={overview}
    />
  )
}

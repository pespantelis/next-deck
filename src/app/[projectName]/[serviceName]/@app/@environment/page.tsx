import { getEnvironmentVariables } from "./actions"
import { EnvironmentListCard } from "./environment-list-card"

interface EnvironmentPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default async function EnvironmentPage({
  params,
}: EnvironmentPageProps) {
  const { projectName, serviceName } = await params
  const environment = await getEnvironmentVariables(projectName, serviceName)

  return (
    <EnvironmentListCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={environment}
    />
  )
}

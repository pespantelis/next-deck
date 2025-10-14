import { getDomains } from "./actions"
import { DomainsListCard } from "./domains-list-card"

interface DomainsPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { projectName, serviceName } = await params
  const domains = await getDomains(projectName, serviceName)

  return (
    <DomainsListCard
      projectName={projectName}
      serviceName={serviceName}
      initialData={domains}
    />
  )
}

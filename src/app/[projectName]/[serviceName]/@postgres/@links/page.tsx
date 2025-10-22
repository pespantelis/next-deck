import { getLinks } from "./actions"
import { LinksCard } from "./links-card"

interface PostgresLinksPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default async function PostgresLinksPage({
  params,
}: PostgresLinksPageProps) {
  const { projectName, serviceName } = await params
  const linksWithStatus = await getLinks(projectName, serviceName)

  return (
    <LinksCard
      projectName={projectName}
      serviceName={serviceName}
      initialLinksWithStatus={linksWithStatus}
    />
  )
}

import { getServiceType } from "./actions"

interface ServiceLayoutProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
  app: React.ReactNode
  postgres: React.ReactNode
}

export default async function ServiceLayout({
  params,
  app,
  postgres,
}: ServiceLayoutProps) {
  const { projectName, serviceName } = await params
  const serviceType = await getServiceType(projectName, serviceName)

  return serviceType === "postgres" ? postgres : app
}

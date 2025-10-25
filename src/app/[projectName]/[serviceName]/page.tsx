import AppServices from "@/components/services/app"
import DatabaseServices from "@/components/services/database"
import type { ServiceIdentifier } from "@/types"

import { getServiceType } from "./actions"

interface ServicePageProps {
  params: Promise<ServiceIdentifier>
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { projectName, serviceName } = await params
  const serviceType = await getServiceType(projectName, serviceName)

  // Handle database services (both PostgreSQL and MongoDB)
  if (serviceType === "postgres" || serviceType === "mongo") {
    return (
      <DatabaseServices
        projectName={projectName}
        serviceName={serviceName}
        dbType={serviceType}
      />
    )
  }

  // Handle app services
  return <AppServices projectName={projectName} serviceName={serviceName} />
}

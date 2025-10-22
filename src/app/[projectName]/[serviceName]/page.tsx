import AppServices from "@/components/services/app"
import PostgresServices from "@/components/services/postgres"
import type { ServiceIdentifier } from "@/types"

import { getServiceType } from "./actions"

interface ServicePageProps {
  params: Promise<ServiceIdentifier>
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { projectName, serviceName } = await params
  const serviceType = await getServiceType(projectName, serviceName)

  return serviceType === "postgres" ? (
    <PostgresServices projectName={projectName} serviceName={serviceName} />
  ) : (
    <AppServices projectName={projectName} serviceName={serviceName} />
  )
}

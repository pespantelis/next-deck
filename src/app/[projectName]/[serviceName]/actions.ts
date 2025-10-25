import { cache } from "react"

import { dokku } from "@/lib/dokku"
import type { ServiceType } from "@/types"

export const getServiceType = cache(
  async (projectName: string, serviceName: string): Promise<ServiceType> => {
    const fullServiceName = `${projectName}-${serviceName}`

    // Check if it's a PostgreSQL service
    const postgresOutput = await dokku.postgres.exists(fullServiceName)
    if (postgresOutput.endsWith("exists")) {
      return "postgres"
    }

    // Check if it's a MongoDB service
    const mongoOutput = await dokku.mongo.exists(fullServiceName)
    if (mongoOutput.endsWith("exists")) {
      return "mongo"
    }

    // Default to app service
    return "app"
  }
)

import { cache } from "react"

import { dokku } from "@/lib/dokku"
import type { ServiceType } from "@/types"

export const getServiceType = cache(
  async (projectName: string, serviceName: string): Promise<ServiceType> => {
    const fullServiceName = `${projectName}-${serviceName}`
    const output = await dokku.postgres.exists(fullServiceName)

    return output.endsWith("exists") ? "postgres" : "app"
  }
)

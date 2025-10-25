"use server"

import { dokku } from "@/lib/dokku"
import type { ServiceType } from "@/types"

export async function startService(
  type: ServiceType,
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`

  switch (type) {
    case "app":
      return dokku.ps.start(appName)
    case "postgres":
      return dokku.postgres.start(appName)
    case "mongo":
      return dokku.mongo.start(appName)
    default:
      throw new Error(`Unsupported service type: ${type}`)
  }
}

export async function stopService(
  type: ServiceType,
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`

  switch (type) {
    case "app":
      return dokku.ps.stop(appName)
    case "postgres":
      return dokku.postgres.stop(appName)
    case "mongo":
      return dokku.mongo.stop(appName)
    default:
      throw new Error(`Unsupported service type: ${type}`)
  }
}

export async function restartService(
  type: ServiceType,
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`

  switch (type) {
    case "app":
      return dokku.ps.restart(appName)
    case "postgres":
      return dokku.postgres.restart(appName)
    case "mongo":
      return dokku.mongo.restart(appName)
    default:
      throw new Error(`Unsupported service type: ${type}`)
  }
}

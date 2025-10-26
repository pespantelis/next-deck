"use server"

import { dokku } from "@/lib/dokku"
import type { DatabaseType } from "@/types"

import type { Data } from "./types"

export async function getOverview(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
): Promise<Data> {
  const appName = `${projectName}-${serviceName}`
  const [dsn, status, exposedPorts] = await Promise.all([
    dokku[dbType].info.dsn(appName),
    dokku[dbType].info.status(appName),
    dokku[dbType].info.exposedPorts(appName),
  ])

  return {
    dsn,
    exposed:
      exposedPorts === "-"
        ? null
        : exposedPorts
            .split(" ")
            .map((port) => port.slice(port.indexOf("->") + 2))
            .join(" "),
    running: status === "running",
    deployed: true,
  }
}

export async function toggleExpose(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
): Promise<{ exposed: boolean }> {
  const appName = `${projectName}-${serviceName}`

  const exposedPorts = await dokku[dbType].info.exposedPorts(appName)
  const isExposed = exposedPorts !== "-"

  if (isExposed) {
    await dokku[dbType].unexpose(appName)
    return { exposed: false }
  }

  if (dbType === "postgres") {
    await dokku[dbType].expose(appName, "127.0.0.1:5432")
    return { exposed: true }
  }
  if (dbType === "mongo") {
    await dokku[dbType].expose(appName, "127.0.0.1:27017 27018 27019 28017")
    return { exposed: true }
  }

  throw new Error(`Unsupported database type: ${dbType}`)
}

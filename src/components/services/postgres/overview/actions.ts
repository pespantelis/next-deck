"use server"

import { dokku } from "@/lib/dokku"

export async function getOverview(projectName: string, serviceName: string) {
  const appName = `${projectName}-${serviceName}`

  const [dsn, status, exposedPorts] = await Promise.all([
    dokku.postgres.info.dsn(appName),
    dokku.postgres.info.status(appName),
    dokku.postgres.info.exposedPorts(appName),
  ])

  return {
    dsn,
    exposed: exposedPorts === "-" ? null : exposedPorts.slice(6),
    running: status === "running",
    deployed: true,
  }
}

export async function toggleExpose(
  projectName: string,
  serviceName: string
): Promise<{ exposed: boolean }> {
  const appName = `${projectName}-${serviceName}`

  const exposedPorts = await dokku.postgres.info.exposedPorts(appName)
  const isExposed = exposedPorts !== "-"

  if (isExposed) {
    await dokku.postgres.unexpose(appName)
    return { exposed: false }
  }

  await dokku.postgres.expose(appName, "127.0.0.1:5432")
  return { exposed: true }
}

"use server"

import { dokku } from "@/lib/dokku"

export async function getOverview(projectName: string, serviceName: string) {
  const appName = `${projectName}-${serviceName}`

  const [dsn, status] = await Promise.all([
    dokku.postgres.info.dsn(appName),
    dokku.postgres.info.status(appName),
  ])

  return {
    dsn,
    running: status === "running",
    deployed: true,
  }
}

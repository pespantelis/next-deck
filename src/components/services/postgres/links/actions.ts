"use server"

import { dokku } from "@/lib/dokku"

async function getLinkedApps(projectName: string, serviceName: string) {
  const postgresName = `${projectName}-${serviceName}`

  const links = await dokku.postgres.links(postgresName)

  return links.split("\n").filter(Boolean)
}

async function getAvailableApps(projectName: string) {
  const apps = await dokku.apps.list()

  return apps
    .split("\n")
    .slice(1) // Remove header
    .filter((app) => app.startsWith(`${projectName}-`))
}

export async function getLinks(projectName: string, serviceName: string) {
  const [linkedApps, availableApps] = await Promise.all([
    getLinkedApps(projectName, serviceName),
    getAvailableApps(projectName),
  ])

  // Create a merged object where keys are app names and values are boolean (linked status)
  const linksWithStatus: Record<string, boolean> = {}

  // Add all available apps as unlinked initially
  availableApps.forEach((app) => {
    linksWithStatus[app] = false
  })

  // Mark linked apps as true
  linkedApps.forEach((app) => {
    linksWithStatus[app] = true
  })

  return Object.entries(linksWithStatus).map(([app, isLinked]) => {
    const linkName = app.startsWith(`${projectName}-`)
      ? app.slice(projectName.length + 1)
      : app

    return {
      name: linkName,
      isLinked,
    }
  })
}

export async function togglePostgresLink(
  projectName: string,
  serviceName: string,
  appName: string
): Promise<{ linked: boolean }> {
  const postgresName = `${projectName}-${serviceName}`
  const fullAppName = `${projectName}-${appName}`

  const output = await dokku.postgres.linked(postgresName, fullAppName)

  if (output.includes("is linked")) {
    await dokku.postgres.unlink(postgresName, fullAppName)
    return {
      linked: false,
    }
  }

  await dokku.postgres.link(postgresName, fullAppName)
  return {
    linked: true,
  }
}

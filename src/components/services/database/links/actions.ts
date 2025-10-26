"use server"

import { dokku } from "@/lib/dokku"
import type { DatabaseType } from "@/types"

import type { Data } from "./types"

async function getLinkedApps(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
) {
  const fullServiceName = `${projectName}-${serviceName}`

  const links = await dokku[dbType].links(fullServiceName)

  return links.split("\n").filter(Boolean)
}

async function getAvailableApps(projectName: string) {
  const apps = await dokku.apps.list()

  return apps
    .split("\n")
    .slice(1) // Remove header
    .filter((app) => app.startsWith(`${projectName}-`))
}

export async function getLinks(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
): Promise<Data[]> {
  const [linkedApps, availableApps] = await Promise.all([
    getLinkedApps(projectName, serviceName, dbType),
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

export async function toggleDatabaseLink(
  projectName: string,
  serviceName: string,
  appName: string,
  dbType: DatabaseType
): Promise<{ linked: boolean }> {
  const fullServiceName = `${projectName}-${serviceName}`
  const fullAppName = `${projectName}-${appName}`

  const output = await dokku[dbType].linked(fullServiceName, fullAppName)

  if (output.includes("is linked")) {
    await dokku[dbType].unlink(fullServiceName, fullAppName)
    return {
      linked: false,
    }
  }

  await dokku[dbType].link(fullServiceName, fullAppName)
  return {
    linked: true,
  }
}

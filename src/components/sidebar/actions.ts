"use server"

import { dokku } from "@/lib/dokku"
import type { Project, Service } from "@/types"

export async function createProject(name: string): Promise<void> {
  return dokku.network.create(name + "-network")
}

export async function createService(
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  const networkName = `${projectName}-network`

  return dokku.apps.create(appName).then(async () => {
    return dokku.options.add(appName, networkName).then(async () => {
      return dokku.proxy.disable(appName)
    })
  })
}

export async function getProjects(): Promise<Project[]> {
  const output = await dokku.network.list()
  const networkSuffix = "-network"

  // Keep only networks ending with network
  return output
    .split("\n")
    .filter((project: string) => project.endsWith(networkSuffix))
    .map((project: string) => ({
      name: project.replace(networkSuffix, ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getServices(projectName: string): Promise<Service[]> {
  const output = await dokku.apps.list()
  const projectPrefix = `${projectName}-`

  // Keep only services starting with project name
  return output
    .split("\n")
    .filter((service: string) => service.startsWith(projectPrefix))
    .map((service: string) => ({
      name: service.replace(projectPrefix, ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

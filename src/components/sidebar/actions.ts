"use server"

import { dokku } from "@/lib/dokku"
import type { Project, Service } from "@/types"

export async function createProject(name: string): Promise<void> {
  dokku.network.create(name + "-network")
}

export async function getProjects(): Promise<Project[]> {
  const output = dokku.network.list()
  const networkSuffix = "-network"

  // Keep only networks ending with network
  return output
    .filter((project: string) => project.endsWith(networkSuffix))
    .map((project: string) => ({
      name: project.replace(networkSuffix, ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getServices(projectName: string): Promise<Service[]> {
  const output = dokku.apps.list()
  const projectPrefix = `${projectName}-`

  // Keep only services starting with project name
  return output
    .filter((service: string) => service.startsWith(projectPrefix))
    .map((service: string) => ({
      name: service.replace(projectPrefix, ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

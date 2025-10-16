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
  const [networksOutput, appsOutput, runningOutput, deployedOutput] =
    await Promise.all([
      dokku.network.list(),
      dokku.apps.list(),
      dokku.ps.report.running(),
      dokku.ps.report.deployed(),
    ])

  const networkSuffix = "-network"

  const networks = networksOutput
    .split("\n")
    .filter((network) => network.endsWith(networkSuffix))
    .map((network) => network.slice(0, -networkSuffix.length))
    .sort()
  const apps = appsOutput.split("\n").slice(1)
  const running = runningOutput.split("\n")
  const deployed = deployedOutput.split("\n")

  const projects: Record<string, Service[]> = Object.fromEntries(
    networks.map((project) => [project, []])
  )

  apps.forEach((app, i) => {
    const project = networks.find((project) => app.startsWith(project + "-"))
    if (!project) return // ignore unknown project

    projects[project].push({
      name: app.slice(project.length + 1), // skip project-
      running: running[i] === "true",
      deployed: deployed[i] === "true",
    })
  })

  return networks
    .map((project) => ({ name: project, services: projects[project] }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

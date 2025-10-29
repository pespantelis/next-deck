"use server"

import { dokku } from "@/lib/dokku"
import type { Project, Service } from "@/types"

export async function checkDokkuExists(): Promise<boolean> {
  try {
    await dokku.version()
    return true
  } catch {
    return false
  }
}

export async function createProject(name: string): Promise<void> {
  return dokku.network.create(name + "-network")
}

export async function createAppService(
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  const networkName = `${projectName}-network`

  return dokku.apps.create(appName).then(async () => {
    return dokku.network.set(appName, networkName)
  })
}

export async function createPostgresService(
  projectName: string,
  serviceName: string
): Promise<void> {
  const postgresName = `${projectName}-${serviceName}`
  const networkName = `${projectName}-network`

  return dokku.postgres.create(postgresName, networkName)
}

export async function createMongoService(
  projectName: string,
  serviceName: string
): Promise<void> {
  const mongoName = `${projectName}-${serviceName}`
  const networkName = `${projectName}-network`

  return dokku.mongo.create(mongoName, networkName)
}

export async function getProjects(): Promise<Project[]> {
  const [
    networksOutput,
    appsOutput,
    postgresOutput,
    mongoOutput,
    appsRunningOutput,
    appsDeployedOutput,
  ] = await Promise.all([
    dokku.network.list(),
    dokku.apps.list(),
    dokku.postgres.list(),
    dokku.mongo.list(),
    dokku.ps.report.running(),
    dokku.ps.report.deployed(),
  ])

  const networkSuffix = "-network"

  const networks = networksOutput
    .split("\n")
    .filter((network) => network.endsWith(networkSuffix))
    .map((network) => network.slice(0, -networkSuffix.length))
    .sort()
  const appServices = appsOutput.split("\n").slice(1)
  const postgresServices = postgresOutput.split("\n").slice(1)
  const mongoServices = mongoOutput.split("\n").slice(1)
  const appsRunning = appsRunningOutput.split("\n")
  const appsDeployed = appsDeployedOutput.split("\n")

  // Get postgres and mongo statuses in parallel
  const [postgresStatuses, mongoStatuses] = await Promise.all([
    Promise.all(postgresServices.map((srv) => dokku.postgres.info.status(srv))),
    Promise.all(mongoServices.map((srv) => dokku.mongo.info.status(srv))),
  ])

  const projects: Record<string, Service[]> = Object.fromEntries(
    networks.map((project) => [project, []])
  )

  // Add app services
  appServices.forEach((srv, i) => {
    const project = networks.find((project) => srv.startsWith(project + "-"))
    if (!project) return // ignore unknown project

    projects[project].push({
      type: "app",
      name: srv.slice(project.length + 1), // skip project-
      running: appsRunning[i] === "true",
      deployed: appsDeployed[i] === "true",
    })
  })

  // Add postgres services
  postgresServices.forEach((srv, i) => {
    const project = networks.find((project) => srv.startsWith(project + "-"))
    if (!project) return // ignore unknown project

    projects[project].push({
      type: "postgres",
      name: srv.slice(project.length + 1), // skip project-
      running: postgresStatuses[i] === "running",
      deployed: true,
    })
  })

  // Add mongo services
  mongoServices.forEach((srv, i) => {
    const project = networks.find((project) => srv.startsWith(project + "-"))
    if (!project) return // ignore unknown project

    projects[project].push({
      type: "mongo",
      name: srv.slice(project.length + 1), // skip project-
      running: mongoStatuses[i] === "running",
      deployed: true,
    })
  })

  return networks
    .map((project) => ({ name: project, services: projects[project] }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

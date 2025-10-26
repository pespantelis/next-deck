"use server"

import { dokku } from "@/lib/dokku"

import type { Data } from "./types"

export async function getOverview(
  projectName: string,
  serviceName: string
): Promise<Data> {
  const appName = `${projectName}-${serviceName}`

  const [port, proxyStatus, runningStatus, deployedStatus] = await Promise.all([
    dokku.config.get(appName, "PORT"),
    dokku.proxy.report(appName),
    dokku.ps.report.running(appName),
    dokku.ps.report.deployed(appName),
  ])

  return {
    alias: appName + ".web",
    port: port,
    isPublic: proxyStatus === "true",
    running: runningStatus === "true",
    deployed: deployedStatus === "true",
  }
}

export async function toggleServiceVisibility(
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`

  const proxyStatus = await dokku.proxy.report(appName)

  return proxyStatus === "true"
    ? dokku.proxy.disable(appName)
    : dokku.proxy.enable(appName)
}

export async function updateServicePort(
  projectName: string,
  serviceName: string,
  port: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`

  return dokku.config.set(appName, { PORT: port })
}

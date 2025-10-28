"use server"

import { dokku } from "@/lib/dokku"

import type { Data } from "./types"

async function getPorts(appName: string): Promise<string> {
  const output = await dokku.ports.report(appName)
  const lines = output.split("\n").slice(1)

  // If it's longer than 38 chars, it means the ports are mapped
  if (lines[0].length > 38) {
    const portIndex = lines[0].indexOf(":")
    return lines[0].slice(portIndex + 1).trim()
  }

  // Otherwise, get the detected ports
  const portDetectedIndex = lines[1].indexOf(":")
  return lines[1].slice(portDetectedIndex + 1).trim()
}

export async function getOverview(
  projectName: string,
  serviceName: string
): Promise<Data> {
  const appName = `${projectName}-${serviceName}`

  const [ports, proxyStatus, runningStatus, deployedStatus] = await Promise.all(
    [
      getPorts(appName),
      dokku.proxy.report(appName),
      dokku.ps.report.running(appName),
      dokku.ps.report.deployed(appName),
    ]
  )

  const internalPort = ports.split(":").pop()

  return {
    ports,
    internalEndpoint: `http://${appName}.web:${internalPort}`,
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

export async function updateServicePorts(
  projectName: string,
  serviceName: string,
  ports: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`

  return dokku.ports.set(appName, ports)
}

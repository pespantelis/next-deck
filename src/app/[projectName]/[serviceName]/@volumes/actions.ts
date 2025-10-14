"use server"

import { dokku } from "@/lib/dokku"

export async function getVolumes(
  projectName: string,
  serviceName: string
): Promise<Record<string, string>> {
  const appName = `${projectName}-${serviceName}`
  const output = await dokku.storage.list(appName)
  const lines = output.split("\n").filter(Boolean)

  const volumes: Record<string, string> = {}
  for (const line of lines) {
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) {
      throw new Error(`Invalid volume: ${line}`)
    }

    const hostPath = line.slice(0, colonIndex)
    const containerPath = line.slice(colonIndex + 1)
    volumes[hostPath] = containerPath
  }

  return volumes
}

export async function unmountVolume(
  projectName: string,
  serviceName: string,
  path: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  return dokku.storage.unmount(appName, path)
}

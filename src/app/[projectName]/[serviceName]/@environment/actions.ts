"use server"

import { dokku } from "@/lib/dokku"

export async function getEnvironmentVariables(
  projectName: string,
  serviceName: string
): Promise<Record<string, string>> {
  const appName = `${projectName}-${serviceName}`
  const lines = dokku.config.export(appName).split(" ").filter(Boolean)

  const env: Record<string, string> = {}
  for (const line of lines) {
    const equalIndex = line.indexOf("=")
    if (equalIndex === -1) {
      throw new Error(`Invalid environment variable: ${line}`)
    }

    const key = line.slice(0, equalIndex)
    const value = line.slice(equalIndex + 1)

    if (
      key.startsWith("DOKKU_") ||
      key.startsWith("GIT_") ||
      key === "NO_VHOST"
    ) {
      continue
    }

    if (!value.startsWith("'") || !value.endsWith("'")) {
      throw new Error(`Invalid environment variable: ${line}`)
    }

    env[key] = value.slice(1, -1)
  }

  return env
}

export async function setEnvironmentVariable(
  projectName: string,
  serviceName: string,
  key: string,
  value: string
) {
  const appName = `${projectName}-${serviceName}`
  dokku.config.set(appName, key, value)
}

export async function deleteEnvironmentVariable(
  projectName: string,
  serviceName: string,
  key: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  dokku.config.unset(appName, key)
}

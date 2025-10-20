"use server"

import { dokku } from "@/lib/dokku"

import { parseEnvText, validateKey } from "./helpers"

export async function getEnvironmentVariables(
  projectName: string,
  serviceName: string
): Promise<Record<string, string>> {
  const appName = `${projectName}-${serviceName}`
  const output = await dokku.config.export(appName)

  return parseEnvText(output, false)
}

export async function setEnvironmentVariable(
  projectName: string,
  serviceName: string,
  key: string,
  value: string
): Promise<void> {
  validateKey(key, "set manually")

  const appName = `${projectName}-${serviceName}`
  return dokku.config.set(appName, { [key]: value })
}

export async function deleteEnvironmentVariable(
  projectName: string,
  serviceName: string,
  key: string
): Promise<void> {
  validateKey(key, "deleted")

  const appName = `${projectName}-${serviceName}`
  return dokku.config.unset(appName, key)
}

export async function importEnvironmentVariables(
  projectName: string,
  serviceName: string,
  envText: string
): Promise<number> {
  const parsed = parseEnvText(envText, true)

  const count = Object.keys(parsed).length
  if (count > 0) {
    const appName = `${projectName}-${serviceName}`
    await dokku.config.set(appName, parsed)
  }

  return count
}

"use server"

import { dokku } from "@/lib/dokku"

export async function getDomains(
  projectName: string,
  serviceName: string
): Promise<string[]> {
  const appName = `${projectName}-${serviceName}`
  const output = await dokku.domains.report(appName)

  return output.split(" ").filter(Boolean)
}

export async function deleteDomain(
  projectName: string,
  serviceName: string,
  domain: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  return dokku.domains.remove(appName, domain)
}

"use server"

import { dokku } from "@/lib/dokku"

export async function getDomains(
  projectName: string,
  serviceName: string
): Promise<string[]> {
  const appName = `${projectName}-${serviceName}`
  return dokku.domains.report(appName).trim().split(" ").filter(Boolean)
}

export async function deleteDomain(
  projectName: string,
  serviceName: string,
  domain: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  dokku.domains.remove(appName, domain)
}

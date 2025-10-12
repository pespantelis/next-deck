"use server"

import { dokku } from "@/lib/dokku"

export async function getDomains(
  projectName: string,
  serviceName: string
): Promise<string[]> {
  const appName = `${projectName}-${serviceName}`
  return dokku.domains.report(appName).trim().split(" ").filter(Boolean)
}

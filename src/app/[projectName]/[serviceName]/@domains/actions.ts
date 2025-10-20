"use server"

import { dokku } from "@/lib/dokku"

export async function getDomains(
  projectName: string,
  serviceName: string
): Promise<{ domains: string[]; letsencrypt: boolean }> {
  const appName = `${projectName}-${serviceName}`
  const [domainsOutput, letsencryptOutput] = await Promise.all([
    dokku.domains.report(appName),
    dokku.letsencrypt.active(appName),
  ])

  return {
    domains: domainsOutput.split(" ").filter(Boolean),
    letsencrypt: letsencryptOutput === "true",
  }
}

export async function deleteDomain(
  projectName: string,
  serviceName: string,
  domain: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  return dokku.domains.remove(appName, domain)
}

export async function enableLetsEncrypt(
  projectName: string,
  serviceName: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  return dokku.letsencrypt.enable(appName)
}

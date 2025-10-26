"use server"

import { dokku } from "@/lib/dokku"

import type { Data } from "./types"

export async function getDomains(
  projectName: string,
  serviceName: string
): Promise<Data> {
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

export async function addDomain(
  projectName: string,
  serviceName: string,
  domain: string
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  return dokku.domains.add(appName, domain)
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

"use server"

import { dokku } from "@/lib/dokku"

import { BUILD_OPTIONS } from "./types"
import type { Data } from "./types"

export async function getBuildOptions(
  projectName: string,
  serviceName: string
): Promise<Data> {
  const appName = `${projectName}-${serviceName}`
  const report = await dokku.dockerOptions.build.report(appName)

  return {
    noCache: report.includes(BUILD_OPTIONS.noCache),
    githubTokenSecret: report.includes(BUILD_OPTIONS.githubTokenSecret),
  }
}

export async function setBuildOption(
  projectName: string,
  serviceName: string,
  option: keyof typeof BUILD_OPTIONS,
  enabled: boolean
): Promise<void> {
  const appName = `${projectName}-${serviceName}`
  const value = BUILD_OPTIONS[option]

  if (enabled) {
    await dokku.dockerOptions.build.add(appName, value)
  } else {
    await dokku.dockerOptions.build.remove(appName, value)
  }
}

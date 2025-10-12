import { useQuery } from "@tanstack/react-query"

import { getVolumes } from "./actions"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "volumes"] as const

export function useVolumes(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
    queryFn: () => getVolumes(projectName, serviceName),
  })
}

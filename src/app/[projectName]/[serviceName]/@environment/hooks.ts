import { useQuery } from "@tanstack/react-query"

import { getEnvironmentVariables } from "./actions"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "environment"] as const

export function useEnvironmentVariables(
  projectName: string,
  serviceName: string
) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
    queryFn: () => getEnvironmentVariables(projectName, serviceName),
  })
}

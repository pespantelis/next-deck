import { useQuery } from "@tanstack/react-query"

import { getDomains } from "./actions"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "domains"] as const

export function useDomains(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
    queryFn: () => getDomains(projectName, serviceName),
  })
}

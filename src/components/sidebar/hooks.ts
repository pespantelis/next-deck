import { useQuery } from "@tanstack/react-query"

import { getProjects, getServices } from "./actions"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 60 * 1000,
  })
}

export function useServices(projectName: string) {
  return useQuery({
    queryKey: ["services", projectName],
    queryFn: () => getServices(projectName),
    staleTime: 60 * 1000,
  })
}

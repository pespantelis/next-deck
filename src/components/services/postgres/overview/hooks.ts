"use client"

import { useQuery } from "@tanstack/react-query"

import { getOverview } from "./actions"

export function useOverview(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: ["overview", "postgres", projectName, serviceName],
    queryFn: () => getOverview(projectName, serviceName),
    staleTime: 30000, // 30 seconds
  })
}

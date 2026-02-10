"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getBuildOptions, setBuildOption } from "./actions"
import type { BuildOptionKey, Data } from "./types"

export function useBuildOptions(
  projectName: string,
  serviceName: string,
  initialData: Data
) {
  return useQuery({
    queryKey: ["build-options", projectName, serviceName],
    queryFn: () => getBuildOptions(projectName, serviceName),
    initialData,
    staleTime: 30000,
  })
}

export function useToggleBuildOption(
  projectName: string,
  serviceName: string,
  option: BuildOptionKey
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (enabled: boolean) =>
      setBuildOption(projectName, serviceName, option, enabled),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["build-options", projectName, serviceName],
      })
      toast.success("Build option updated.")
    },
  })
}

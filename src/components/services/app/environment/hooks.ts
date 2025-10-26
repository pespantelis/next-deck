import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  deleteEnvironmentVariable,
  getEnvironmentVariables,
  importEnvironmentVariables,
  setEnvironmentVariable,
} from "./actions"
import type { Data } from "./types"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "environment"] as const

export function useEnvironmentVariables(
  projectName: string,
  serviceName: string,
  initialData: Data
) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
    queryFn: () => getEnvironmentVariables(projectName, serviceName),
    initialData,
  })
}

export function useSetEnvironmentVariable(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      setEnvironmentVariable(projectName, serviceName, key, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildKey(projectName, serviceName),
      })
      onSuccess()
      toast.success("Environment variable saved successfully.")
    },
  })
}

export function useDeleteEnvironmentVariable(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (key: string) =>
      deleteEnvironmentVariable(projectName, serviceName, key),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildKey(projectName, serviceName),
      })
      onSuccess()
      toast.success("Environment variable deleted successfully.")
    },
  })
}

export function useImportEnvironmentVariables(
  projectName: string,
  serviceName: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (envText: string) =>
      importEnvironmentVariables(projectName, serviceName, envText),
    onSuccess: async (count) => {
      await queryClient.invalidateQueries({
        queryKey: buildKey(projectName, serviceName),
      })
      toast.success(
        `Successfully imported ${count} environment variable${count !== 1 ? "s" : ""}.`
      )
    },
  })
}

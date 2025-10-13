import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteEnvironmentVariable, getEnvironmentVariables } from "./actions"

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

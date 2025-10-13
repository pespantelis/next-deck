import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteDomain, getDomains } from "./actions"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "domains"] as const

export function useDomains(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
    queryFn: () => getDomains(projectName, serviceName),
  })
}

export function useDeleteDomain(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (domain: string) =>
      deleteDomain(projectName, serviceName, domain),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildKey(projectName, serviceName),
      })
      onSuccess()
      toast.success("Domain deleted successfully.")
    },
  })
}

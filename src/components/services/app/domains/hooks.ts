import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  addDomain,
  deleteDomain,
  enableLetsEncrypt,
  getDomains,
} from "./actions"
import type { Data } from "./types"

export function useDomains(
  projectName: string,
  serviceName: string,
  initialData: Data
) {
  return useQuery({
    queryKey: ["domains", projectName, serviceName],
    queryFn: () => getDomains(projectName, serviceName),
    initialData,
  })
}

export function useAddDomain(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (domain: string) => addDomain(projectName, serviceName, domain),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["domains", projectName, serviceName],
      })
      onSuccess()
      toast.success("Domain added successfully.")
    },
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
        queryKey: ["domains", projectName, serviceName],
      })
      onSuccess()
      toast.success("Domain deleted successfully.")
    },
  })
}

export function useEnableLetsEncrypt(projectName: string, serviceName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => enableLetsEncrypt(projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["domains", projectName, serviceName],
      })
      toast.success("Let's Encrypt enabled successfully.")
    },
  })
}

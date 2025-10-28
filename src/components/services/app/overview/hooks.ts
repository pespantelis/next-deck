"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  getOverview,
  toggleServiceVisibility,
  updateServicePorts,
} from "./actions"
import type { Data } from "./types"

export function useOverview(
  projectName: string,
  serviceName: string,
  initialData: Data
) {
  return useQuery({
    queryKey: ["overview", projectName, serviceName],
    queryFn: () => getOverview(projectName, serviceName),
    initialData,
    staleTime: 30000, // 30 seconds
  })
}

export function useToggleVisibility(projectName: string, serviceName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleServiceVisibility(projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", projectName, serviceName],
      })
      toast.success("Service visibility toggled successfully.")
    },
  })
}

export function useUpdatePorts(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ports }: { ports: string }) =>
      updateServicePorts(projectName, serviceName, ports),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", projectName, serviceName],
      })
      onSuccess()
      toast.success("Ports updated successfully.")
    },
  })
}

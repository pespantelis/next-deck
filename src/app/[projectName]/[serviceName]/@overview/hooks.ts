"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  getOverview,
  toggleServiceVisibility,
  updateServicePort,
} from "./actions"

export function useOverview(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: ["overview", projectName, serviceName],
    queryFn: () => getOverview(projectName, serviceName),
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

export function useUpdatePort(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ port }: { port: string }) =>
      updateServicePort(projectName, serviceName, port),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", projectName, serviceName],
      })
      onSuccess()
      toast.success("Port updated successfully.")
    },
  })
}

"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  getOverview,
  restartService,
  startService,
  stopService,
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

export function useStartService(projectName: string, serviceName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => startService(projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", projectName, serviceName],
      })
      toast.success("Service started successfully.")
    },
  })
}

export function useStopService(projectName: string, serviceName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => stopService(projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", projectName, serviceName],
      })
      toast.success("Service stopped successfully.")
    },
  })
}

export function useRestartService(projectName: string, serviceName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => restartService(projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", projectName, serviceName],
      })
      toast.success("Service restarted successfully.")
    },
  })
}

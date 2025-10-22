"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { ServiceType } from "@/types"

import { restartService, startService, stopService } from "./actions"

export function useStartService(
  type: ServiceType,
  projectName: string,
  serviceName: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => startService(type, projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", type, projectName, serviceName],
      })
      toast.success("Service started successfully.")
    },
  })
}

export function useStopService(
  type: ServiceType,
  projectName: string,
  serviceName: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => stopService(type, projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", type, projectName, serviceName],
      })
      toast.success("Service stopped successfully.")
    },
  })
}

export function useRestartService(
  type: ServiceType,
  projectName: string,
  serviceName: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => restartService(type, projectName, serviceName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", type, projectName, serviceName],
      })
      toast.success("Service restarted successfully.")
    },
  })
}

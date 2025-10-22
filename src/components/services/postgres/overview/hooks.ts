"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getOverview, toggleExpose } from "./actions"

export function useOverview(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: ["overview", "postgres", projectName, serviceName],
    queryFn: () => getOverview(projectName, serviceName),
    staleTime: 30000, // 30 seconds
  })
}

export function useToggleExpose(projectName: string, serviceName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleExpose(projectName, serviceName),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", "postgres", projectName, serviceName],
      })
      toast.success(
        data.exposed
          ? "Service exposed successfully."
          : "Service unexposed successfully."
      )
    },
  })
}

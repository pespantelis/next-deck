"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { DatabaseType } from "@/types"

import { getOverview, toggleExpose } from "./actions"

export function useOverview(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
) {
  return useQuery({
    queryKey: ["overview", dbType, projectName, serviceName],
    queryFn: () => getOverview(projectName, serviceName, dbType),
    staleTime: 30000, // 30 seconds
  })
}

export function useToggleExpose(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleExpose(projectName, serviceName, dbType),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["overview", dbType, projectName, serviceName],
      })
      toast.success(
        data.exposed
          ? "Service exposed successfully."
          : "Service unexposed successfully."
      )
    },
  })
}

"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { DatabaseType } from "@/types"

import { getLinks, toggleDatabaseLink } from "./actions"

interface LinkWithStatus {
  name: string
  isLinked: boolean
}

interface UseDatabaseLinksProps {
  projectName: string
  serviceName: string
  dbType: DatabaseType
  initialLinksWithStatus: LinkWithStatus[]
}

export function useDatabaseLinks({
  projectName,
  serviceName,
  dbType,
  initialLinksWithStatus,
}: UseDatabaseLinksProps) {
  return useQuery({
    queryKey: [`${dbType}-links`, projectName, serviceName],
    queryFn: () => getLinks(projectName, serviceName, dbType),
    initialData: initialLinksWithStatus,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useToggleDatabaseLink(
  projectName: string,
  serviceName: string,
  dbType: DatabaseType
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkName: string) =>
      toggleDatabaseLink(projectName, serviceName, linkName, dbType),
    onSuccess: async ({ linked }) => {
      await queryClient.invalidateQueries({
        queryKey: [`${dbType}-links`, projectName, serviceName],
      })
      toast.success(
        linked
          ? `Service linked successfully.`
          : `Service unlinked successfully.`
      )
    },
  })
}

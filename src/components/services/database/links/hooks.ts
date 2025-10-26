"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { DatabaseType } from "@/types"

import { getLinks, toggleDatabaseLink } from "./actions"
import type { Data } from "./types"

interface UseDatabaseLinksProps {
  projectName: string
  serviceName: string
  dbType: DatabaseType
  initialData: Data[]
}

export function useDatabaseLinks({
  projectName,
  serviceName,
  dbType,
  initialData,
}: UseDatabaseLinksProps) {
  return useQuery({
    queryKey: ["links", projectName, serviceName],
    queryFn: () => getLinks(projectName, serviceName, dbType),
    initialData,
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
        queryKey: ["links", projectName, serviceName],
      })
      toast.success(
        linked
          ? `Service linked successfully.`
          : `Service unlinked successfully.`
      )
    },
  })
}

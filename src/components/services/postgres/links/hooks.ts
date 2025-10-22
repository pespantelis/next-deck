"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getLinks, togglePostgresLink } from "./actions"

interface LinkWithStatus {
  name: string
  isLinked: boolean
}

interface UsePostgresLinksProps {
  projectName: string
  serviceName: string
  initialLinksWithStatus: LinkWithStatus[]
}

export function usePostgresLinks({
  projectName,
  serviceName,
  initialLinksWithStatus,
}: UsePostgresLinksProps) {
  return useQuery({
    queryKey: ["postgres-links", projectName, serviceName],
    queryFn: () => getLinks(projectName, serviceName),
    initialData: initialLinksWithStatus,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useTogglePostgresLink(
  projectName: string,
  serviceName: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkName: string) =>
      togglePostgresLink(projectName, serviceName, linkName),
    onSuccess: async ({ linked }) => {
      await queryClient.invalidateQueries({
        queryKey: ["postgres-links", projectName, serviceName],
      })
      toast.success(
        linked
          ? `Service linked successfully.`
          : `Service unlinked successfully.`
      )
    },
  })
}

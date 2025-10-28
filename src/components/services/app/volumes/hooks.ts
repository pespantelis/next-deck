import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getVolumes, mountVolume, unmountVolume } from "./actions"
import type { Data } from "./types"

export function useVolumes(
  projectName: string,
  serviceName: string,
  initialData: Data
) {
  return useQuery({
    queryKey: ["volumes", projectName, serviceName],
    queryFn: () => getVolumes(projectName, serviceName),
    initialData,
  })
}

export function useUnmountVolume(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      hostPath,
      containerPath,
    }: {
      hostPath: string
      containerPath: string
    }) => unmountVolume(projectName, serviceName, hostPath, containerPath),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["volumes", projectName, serviceName],
      })
      onSuccess()
      toast.success("Volume unmounted successfully.")
    },
  })
}

export function useMountVolume(
  projectName: string,
  serviceName: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      hostPath,
      containerPath,
    }: {
      hostPath: string
      containerPath: string
    }) => mountVolume(projectName, serviceName, hostPath, containerPath),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["volumes", projectName, serviceName],
      })
      onSuccess()
      toast.success("Volume mounted successfully.")
    },
  })
}

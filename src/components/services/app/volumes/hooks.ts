import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getVolumes, unmountVolume } from "./actions"
import type { Data } from "./types"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "volumes"] as const

export function useVolumes(
  projectName: string,
  serviceName: string,
  initialData: Data
) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
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
    mutationFn: (hostPath: string) =>
      unmountVolume(projectName, serviceName, hostPath),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildKey(projectName, serviceName),
      })
      onSuccess()
      toast.success("Volume unmounted successfully.")
    },
  })
}

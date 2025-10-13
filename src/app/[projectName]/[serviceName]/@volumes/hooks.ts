import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getVolumes, unmountVolume } from "./actions"

const buildKey = (projectName: string, serviceName: string) =>
  ["service", projectName, serviceName, "volumes"] as const

export function useVolumes(projectName: string, serviceName: string) {
  return useQuery({
    queryKey: buildKey(projectName, serviceName),
    queryFn: () => getVolumes(projectName, serviceName),
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

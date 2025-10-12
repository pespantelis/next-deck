import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createProject, getProjects, getServices } from "./actions"

const buildProjectsKey = () => ["projects"] as const
const buildServicesKey = (projectName: string) =>
  ["services", projectName] as const

export function useProjects() {
  return useQuery({
    queryKey: buildProjectsKey(),
    queryFn: getProjects,
  })
}

export function useServices(projectName: string) {
  return useQuery({
    queryKey: buildServicesKey(projectName),
    queryFn: () => getServices(projectName),
  })
}

export function useCreateProject(onSuccess: (projectName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name }: { name: string }) => createProject(name),
    onSuccess: async (_, { name }) => {
      await queryClient.invalidateQueries({ queryKey: buildProjectsKey() })
      onSuccess(name)
      toast.success("Project created successfully.")
    },
  })
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createProject, getProjects, getServices } from "./actions"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 60 * 1000,
  })
}

export function useServices(projectName: string) {
  return useQuery({
    queryKey: ["services", projectName],
    queryFn: () => getServices(projectName),
    staleTime: 60 * 1000,
  })
}

export function useCreateProject(onSuccess: (projectName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name }: { name: string }) => createProject(name),
    onSuccess: async (_, { name }) => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      onSuccess(name)
      toast.success("Project created successfully.")
    },
  })
}

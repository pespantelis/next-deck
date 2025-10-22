import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type {
  Project,
  Service,
  ServiceCreatedCallback,
  ServiceType,
} from "@/types"

import { createProject, getProjects } from "./actions"

export function useProjects(initialData: Project[]): Project[] {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return projects
}

export function useCreateProject(onSuccess: (projectName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name }: { name: string }) => createProject(name),
    onSuccess: async (_, { name }) => {
      // Optimistically add project to the projects list
      queryClient.setQueryData(["projects"], (old: Project[] = []) => {
        const newProject: Project = { name, services: [] }
        return [...old, newProject].sort((a, b) => a.name.localeCompare(b.name))
      })

      onSuccess(name)
      toast.success("Project created successfully.")
    },
  })
}

export function useCreateService(
  serviceType: ServiceType,
  mutationFn: (projectName: string, serviceName: string) => Promise<void>,
  onSuccess: ServiceCreatedCallback
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectName,
      serviceName,
    }: {
      projectName: string
      serviceName: string
    }) => mutationFn(projectName, serviceName),

    onSuccess: async (_, { projectName, serviceName }) => {
      const newService: Service = {
        type: serviceType,
        name: serviceName,
        running: false,
        deployed: false,
      }

      // Optimistically add service to the project in the main projects query
      queryClient.setQueryData(["projects"], (old: Project[] = []) => {
        return old.map((project) =>
          project.name === projectName
            ? {
                ...project,
                services: [...project.services, newService].sort((a, b) =>
                  a.name.localeCompare(b.name)
                ),
              }
            : project
        )
      })

      onSuccess(serviceName)
      toast.success("Service created successfully.")
    },
  })
}

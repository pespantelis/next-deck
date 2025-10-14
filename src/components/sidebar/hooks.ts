import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { Project, Service } from "@/types"

import {
  createProject,
  createService,
  getProjects,
  getServices,
} from "./actions"

const buildProjectsKey = () => ["projects"] as const
const buildServicesKey = (projectName: string) =>
  ["services", projectName] as const

export function useProjects(initialData?: Project[]) {
  return useQuery({
    queryKey: buildProjectsKey(),
    queryFn: getProjects,
    initialData,
  })
}

export function useServices(projectName: string, initialData?: Service[]) {
  return useQuery({
    queryKey: buildServicesKey(projectName),
    queryFn: () => getServices(projectName),
    initialData,
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

export function useCreateService(onSuccess: (serviceName: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectName,
      serviceName,
    }: {
      projectName: string
      serviceName: string
    }) => createService(projectName, serviceName),
    onSuccess: async (_, { projectName, serviceName }) => {
      await queryClient.invalidateQueries({
        queryKey: buildServicesKey(projectName),
      })
      onSuccess(serviceName)
      toast.success("Service created successfully.")
    },
  })
}

"use server"

import type { Project, Service } from "@/types"

export async function getProjects(): Promise<Project[]> {
  return []
}

export async function getServices(projectName: string): Promise<Service[]> {
  return []
}

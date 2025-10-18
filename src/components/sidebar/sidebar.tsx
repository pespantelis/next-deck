"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import {
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import type { Project } from "@/types"

import { StatusIcon } from "../status"
import { Button } from "../ui/button"
import { useCreateProjectDialog } from "./create-project-dialog"
import { useCreateServiceDialog } from "./create-service-dialog"
import { useProjects } from "./hooks"

interface DeckSidebarGroupsProps {
  initialProjects: Project[]
}

export function DeckSidebarGroups({ initialProjects }: DeckSidebarGroupsProps) {
  const projects = useProjects(initialProjects)

  return projects.map((project) => (
    <DeckSidebarGroup key={project.name} project={project} />
  ))
}

function DeckSidebarGroup({ project }: { project: Project }) {
  const router = useRouter()
  const pathname = usePathname()
  const openCreateServiceDialog = useCreateServiceDialog()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm">{project.name}</SidebarGroupLabel>
      <SidebarGroupAction
        onClick={() =>
          openCreateServiceDialog(project.name, (serviceName) => {
            router.push(`/${project.name}/${serviceName}`)
          })
        }
      >
        <PlusIcon />
        <span className="sr-only">Add service</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {project.services.length === 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" disabled>
                <span>No services</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {project.services.map((service) => {
            const servicePath = `/${project.name}/${service.name}`
            const isActive = pathname.startsWith(servicePath)

            return (
              <SidebarMenuItem key={service.name}>
                <SidebarMenuButton size="sm" isActive={isActive} asChild>
                  <Link href={servicePath}>
                    <StatusIcon
                      running={service.running}
                      deployed={service.deployed}
                    />
                    <span>{service.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function DeckSidebarGroupsSkeleton() {
  return Array.from({ length: 3 }).map((_, groupIndex) => (
    <SidebarGroup key={groupIndex}>
      <SidebarMenuSkeleton />
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: 2 + (groupIndex % 2) }).map((_, itemIndex) => (
            <SidebarMenuItem key={itemIndex}>
              <SidebarMenuSkeleton className="h-7" showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))
}

export function DeckSidebarFooter() {
  const openCreateProjectDialog = useCreateProjectDialog()

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Button
              variant="outline"
              onClick={() => openCreateProjectDialog(() => {})}
            >
              <PlusIcon />
              <span>New project</span>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

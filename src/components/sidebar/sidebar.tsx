"use client"

import { useEffect, useState } from "react"
import { ChevronsUpDown, Server } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"

import { useCreateProjectDialog } from "./create-project-dialog"
import { useProjects } from "./hooks"
import { ServiceList } from "./service-list"

export function ProjectSidebar() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { isMobile } = useSidebar()

  const { data: projects = [] } = useProjects()
  const openCreateProjectDialog = useCreateProjectDialog()

  // Set initial project when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0])
    }
  }, [projects, selectedProject])

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Server className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span
                      className={cn("truncate font-medium", {
                        "text-muted-foreground": !selectedProject?.name,
                      })}
                    >
                      {selectedProject?.name || "loading..."}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Projects
                </DropdownMenuLabel>
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.name}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <Server className="size-3.5 shrink-0" />
                    </div>
                    <span>{project.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    openCreateProjectDialog((projectName) => {
                      setSelectedProject({ name: projectName })
                    })
                  }
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Server className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add project
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            {selectedProject && (
              <ServiceList projectName={selectedProject.name} />
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

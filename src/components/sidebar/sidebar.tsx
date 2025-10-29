"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Empty, EmptyHeader, EmptyMedia } from "../ui/empty"
import { useCreateProjectDialog } from "./create-project-dialog"
import {
  useCreateAppServiceDialog,
  useCreateMongoServiceDialog,
  useCreatePostgresServiceDialog,
} from "./create-service-dialog"
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
  const openCreateAppServiceDialog = useCreateAppServiceDialog()
  const openCreatePostgresServiceDialog = useCreatePostgresServiceDialog()
  const openCreateMongoServiceDialog = useCreateMongoServiceDialog()

  const navigateToService = (serviceName: string) => {
    router.push(`/${project.name}/${serviceName}`)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm">{project.name}</SidebarGroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarGroupAction>
            <PlusIcon />
            <span className="sr-only">Add service</span>
          </SidebarGroupAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              openCreateAppServiceDialog(project.name, navigateToService)
            }
          >
            App
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openCreatePostgresServiceDialog(project.name, navigateToService)
            }
          >
            Postgres
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openCreateMongoServiceDialog(project.name, navigateToService)
            }
          >
            Mongo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

export function DeckSidebarEmpty({ children }: { children: React.ReactNode }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <Empty className="p-0 px-2 py-6 md:p-0 md:px-4 md:py-12">
          <EmptyHeader>
            <EmptyMedia>
              <Image src="/dokku.svg" alt="Dokku" width={89} height={62} />
            </EmptyMedia>
            {children}
          </EmptyHeader>
        </Empty>
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

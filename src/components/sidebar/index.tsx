import { Suspense } from "react"

import { EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

import { checkDokkuExists, getProjects } from "./actions"
import {
  DeckSidebarEmpty,
  DeckSidebarFooter,
  DeckSidebarGroups,
  DeckSidebarGroupsSkeleton,
} from "./sidebar"

export function DeckSidebar() {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarContent>
        <Suspense fallback={<DeckSidebarGroupsSkeleton />}>
          <DeckSidebarGroupsWithData />
        </Suspense>
      </SidebarContent>

      <DeckSidebarFooter />
    </Sidebar>
  )
}

async function DeckSidebarGroupsWithData() {
  const dokkuExists = await checkDokkuExists()
  if (!dokkuExists) {
    return (
      <DeckSidebarEmpty>
        <EmptyTitle>Dokku is not installed</EmptyTitle>
        <EmptyDescription>
          Please install Dokku to manage your applications.
        </EmptyDescription>
      </DeckSidebarEmpty>
    )
  }

  const projects = await getProjects()
  if (projects.length === 0) {
    return (
      <DeckSidebarEmpty>
        <EmptyTitle>No projects found</EmptyTitle>
        <EmptyDescription>
          Please create a project to get started.
        </EmptyDescription>
      </DeckSidebarEmpty>
    )
  }

  return <DeckSidebarGroups initialProjects={projects} />
}

import { Suspense } from "react"

import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

import { getProjects } from "./actions"
import {
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
  const projects = await getProjects()
  return <DeckSidebarGroups initialProjects={projects} />
}

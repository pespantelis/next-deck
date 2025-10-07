import Link from "next/link"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useServices } from "./hooks"

interface ServiceListProps {
  projectName: string
}

export function ServiceList({ projectName }: ServiceListProps) {
  const { data: services = [] } = useServices(projectName)

  if (!services.length) {
    return null
  }

  return (
    <SidebarMenu>
      {services.map((service) => (
        <SidebarMenuItem key={service.name}>
          <SidebarMenuButton asChild>
            <Link href={`/${projectName}/${service.name}`}>
              <span>{service.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

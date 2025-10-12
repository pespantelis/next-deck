"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

  if (!services.length) {
    return null
  }

  return (
    <SidebarMenu>
      {services.map((service) => {
        const servicePath = `/${projectName}/${service.name}`
        const isActive = pathname.startsWith(servicePath)

        return (
          <SidebarMenuItem key={service.name}>
            <SidebarMenuButton isActive={isActive} asChild>
              <Link href={servicePath}>
                <span>{service.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

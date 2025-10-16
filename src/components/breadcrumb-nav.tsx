"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbNav() {
  const pathname = usePathname()

  // Split pathname into segments and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean)

  const items = ["projects", ...pathSegments]
  const breadcrumbItems = items.slice(0, -1).flatMap((segment, index) => {
    const href = "/" + pathSegments.slice(0, index).join("/")

    return [
      <BreadcrumbItem key={href}>
        <BreadcrumbLink asChild>
          <Link href={href}>{segment}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>,
      <BreadcrumbSeparator key={`sep-${href}`} />,
    ]
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}

        <BreadcrumbItem key={items[items.length - 1]}>
          <BreadcrumbPage>{items[items.length - 1]}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

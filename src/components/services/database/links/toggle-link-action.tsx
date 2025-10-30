"use client"

import { ListCardItemAction } from "@/components/list-card"
import { Spinner } from "@/components/ui/spinner"
import { DatabaseType } from "@/types"

import { useToggleDatabaseLink } from "./hooks"
import type { Data } from "./types"

interface ToggleLinkActionProps {
  projectName: string
  serviceName: string
  dbType: DatabaseType
  link: Data
}

export function ToggleLinkAction({
  projectName,
  serviceName,
  dbType,
  link,
}: ToggleLinkActionProps) {
  const toggleLinkMutation = useToggleDatabaseLink(
    projectName,
    serviceName,
    dbType
  )

  return (
    <ListCardItemAction
      size="default"
      onClick={() => toggleLinkMutation.mutate(link.name)}
      disabled={toggleLinkMutation.isPending}
    >
      {toggleLinkMutation.isPending && <Spinner />}
      {link.isLinked ? "Unlink" : "Link"}
    </ListCardItemAction>
  )
}

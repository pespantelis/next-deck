"use client"

import { LinkIcon, UnlinkIcon } from "lucide-react"

import {
  ListCard,
  ListCardEmpty,
  ListCardHeader,
  ListCardItem,
  ListCardItemAction,
  ListCardItemActions,
  ListCardItemContent,
  ListCardItems,
  ListCardTitle,
} from "@/components/list-card"
import { ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import type { DatabaseType } from "@/types"

import { useDatabaseLinks, useToggleDatabaseLink } from "./hooks"
import type { Data } from "./types"

interface LinksCardProps {
  projectName: string
  serviceName: string
  dbType: DatabaseType
  initialData: Data[]
}

export function LinksCard({
  projectName,
  serviceName,
  dbType,
  initialData,
}: LinksCardProps) {
  const { data } = useDatabaseLinks({
    projectName,
    serviceName,
    dbType,
    initialData,
  })
  const toggleLinkMutation = useToggleDatabaseLink(
    projectName,
    serviceName,
    dbType
  )

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Links</ListCardTitle>
      </ListCardHeader>

      {data.length === 0 ? (
        <ListCardEmpty>No links configured</ListCardEmpty>
      ) : (
        <ListCardItems>
          {data.map((link) => (
            <ListCardItem key={link.name}>
              <ItemMedia variant="icon">
                {link.isLinked ? (
                  <LinkIcon className="text-blue-500" />
                ) : (
                  <UnlinkIcon />
                )}
              </ItemMedia>
              <ListCardItemContent>
                <ItemTitle className="w-full font-mono">
                  <span className="truncate">{link.name}</span>
                </ItemTitle>
              </ListCardItemContent>
              <ListCardItemActions>
                <ListCardItemAction
                  size="default"
                  onClick={() => toggleLinkMutation.mutate(link.name)}
                  disabled={toggleLinkMutation.isPending}
                >
                  {toggleLinkMutation.isPending && <Spinner />}
                  {link.isLinked ? "Unlink" : "Link"}
                </ListCardItemAction>
              </ListCardItemActions>
            </ListCardItem>
          ))}
        </ListCardItems>
      )}
    </ListCard>
  )
}

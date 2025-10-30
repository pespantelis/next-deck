"use client"

import { LinkIcon, UnlinkIcon } from "lucide-react"

import {
  ListCard,
  ListCardEmpty,
  ListCardHeader,
  ListCardItem,
  ListCardItemActions,
  ListCardItemContent,
  ListCardItems,
  ListCardTitle,
} from "@/components/list-card"
import { ItemMedia, ItemTitle } from "@/components/ui/item"
import type { DatabaseType } from "@/types"

import { useDatabaseLinks } from "./hooks"
import { ToggleLinkAction } from "./toggle-link-action"
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
                <ToggleLinkAction
                  projectName={projectName}
                  serviceName={serviceName}
                  dbType={dbType}
                  link={link}
                />
              </ListCardItemActions>
            </ListCardItem>
          ))}
        </ListCardItems>
      )}
    </ListCard>
  )
}

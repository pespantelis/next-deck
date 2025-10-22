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

import { usePostgresLinks, useTogglePostgresLink } from "./hooks"

interface LinkWithStatus {
  name: string
  isLinked: boolean
}

interface LinksCardProps {
  projectName: string
  serviceName: string
  initialLinksWithStatus: LinkWithStatus[]
}

export function LinksCard({
  projectName,
  serviceName,
  initialLinksWithStatus,
}: LinksCardProps) {
  const { data: linksWithStatus } = usePostgresLinks({
    projectName,
    serviceName,
    initialLinksWithStatus,
  })
  const toggleLinkMutation = useTogglePostgresLink(projectName, serviceName)

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Links</ListCardTitle>
      </ListCardHeader>

      {linksWithStatus.length === 0 ? (
        <ListCardEmpty>No links configured</ListCardEmpty>
      ) : (
        <ListCardItems>
          {linksWithStatus.map((link) => (
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

"use client"

import { BoxIcon, KeyIcon } from "lucide-react"

import {
  ListCard,
  ListCardHeader,
  ListCardItem,
  ListCardItemActions,
  ListCardItemContent,
  ListCardItems,
  ListCardTitle,
} from "@/components/list-card"
import { ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"

import { useBuildOptions, useToggleBuildOption } from "./hooks"
import type { Data } from "./types"

interface BuildOptionsCardProps {
  projectName: string
  serviceName: string
  initialData: Data
}

export function BuildOptionsCard({
  projectName,
  serviceName,
  initialData,
}: BuildOptionsCardProps) {
  const { data } = useBuildOptions(projectName, serviceName, initialData)
  const toggleNoCache = useToggleBuildOption(
    projectName,
    serviceName,
    "noCache"
  )
  const toggleGithubToken = useToggleBuildOption(
    projectName,
    serviceName,
    "githubTokenSecret"
  )

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Build options</ListCardTitle>
      </ListCardHeader>

      <ListCardItems>
        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <BoxIcon />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>No cache</ItemTitle>
            <ItemDescription>Build without using cache</ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <Switch
              checked={data.noCache}
              onCheckedChange={(checked) => toggleNoCache.mutate(checked)}
              disabled={toggleNoCache.isPending}
              aria-label="Toggle no-cache build option"
            />
          </ListCardItemActions>
        </ListCardItem>

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <KeyIcon />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>GitHub token secret</ItemTitle>
            <ItemDescription>
              Mount GitHub token for private repo access
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <Switch
              checked={data.githubTokenSecret}
              onCheckedChange={(checked) => toggleGithubToken.mutate(checked)}
              disabled={toggleGithubToken.isPending}
              aria-label="Toggle GitHub token secret build option"
            />
          </ListCardItemActions>
        </ListCardItem>
      </ListCardItems>
    </ListCard>
  )
}

"use client"

import {
  CopyIcon,
  EarthIcon,
  HatGlassesIcon,
  LinkIcon,
  PencilIcon,
  ServerIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  ListCard,
  ListCardHeader,
  ListCardItem,
  ListCardItemAction,
  ListCardItemActions,
  ListCardItemContent,
  ListCardItems,
  ListCardTitle,
} from "@/components/list-card"
import { OverviewStatus } from "@/components/overview-status"
import { ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"

import { useEditPortsDialog } from "./edit-ports-dialog"
import { useOverview, useToggleVisibility } from "./hooks"
import type { Data } from "./types"

interface OverviewCardProps {
  projectName: string
  serviceName: string
  initialData: Data
}

export function OverviewCard({
  projectName,
  serviceName,
  initialData,
}: OverviewCardProps) {
  const { data } = useOverview(projectName, serviceName, initialData)
  const toggleVisibility = useToggleVisibility(projectName, serviceName)
  const editPortsDialog = useEditPortsDialog(projectName, serviceName)

  const copyInternalEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(data.internalEndpoint)
      toast.success("Endpoint copied to clipboard")
    } catch {
      toast.error("Failed to copy endpoint")
    }
  }

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Overview</ListCardTitle>
      </ListCardHeader>

      <ListCardItems>
        <OverviewStatus
          type="app"
          projectName={projectName}
          serviceName={serviceName}
          running={data.running}
          deployed={data.deployed}
        />

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <ServerIcon />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Container ports</ItemTitle>
            <ItemDescription>{data.ports}</ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction
              onClick={() => editPortsDialog({ ports: data.ports })}
            >
              <PencilIcon />
            </ListCardItemAction>
          </ListCardItemActions>
        </ListCardItem>

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <LinkIcon />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Internal endpoint</ItemTitle>
            <ItemDescription>{data.internalEndpoint}</ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction onClick={copyInternalEndpoint}>
              <CopyIcon />
            </ListCardItemAction>
          </ListCardItemActions>
        </ListCardItem>

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            {data.isPublic ? <EarthIcon /> : <HatGlassesIcon />}
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Visibility</ItemTitle>
            <ItemDescription>
              {data.isPublic ? "Public" : "Private"}
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <Switch
              checked={data.isPublic}
              onCheckedChange={() => toggleVisibility.mutate()}
              disabled={toggleVisibility.isPending}
              aria-label="Toggle service visibility"
            />
          </ListCardItemActions>
        </ListCardItem>
      </ListCardItems>
    </ListCard>
  )
}

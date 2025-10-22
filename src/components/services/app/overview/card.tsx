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

import { useEditPortDialog } from "./edit-port-dialog"
import { useOverview, useToggleVisibility } from "./hooks"

interface OverviewCardProps {
  projectName: string
  serviceName: string
  initialData: {
    alias: string
    port: string
    isPublic: boolean
    running: boolean
    deployed: boolean
  }
}

export function OverviewCard({
  projectName,
  serviceName,
  initialData,
}: OverviewCardProps) {
  const { data: overview = initialData } = useOverview(projectName, serviceName)
  const toggleVisibility = useToggleVisibility(projectName, serviceName)
  const editPortDialog = useEditPortDialog(projectName, serviceName)

  const internalEndpoint = `http://${overview.alias}:${overview.port}`

  const copyInternalEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(internalEndpoint)
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
          running={overview.running}
          deployed={overview.deployed}
        />

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <ServerIcon />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Container port</ItemTitle>
            <ItemDescription>{overview.port || "-"}</ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction
              onClick={() => editPortDialog({ port: overview.port })}
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
            <ItemDescription>{internalEndpoint}</ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction onClick={copyInternalEndpoint}>
              <CopyIcon />
            </ListCardItemAction>
          </ListCardItemActions>
        </ListCardItem>

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            {overview.isPublic ? <EarthIcon /> : <HatGlassesIcon />}
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Visibility</ItemTitle>
            <ItemDescription>
              {overview.isPublic ? "Public" : "Private"}
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <Switch
              checked={overview.isPublic}
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

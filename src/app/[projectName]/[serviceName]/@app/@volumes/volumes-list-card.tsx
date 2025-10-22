"use client"

import { CircleMinusIcon, PlusIcon } from "lucide-react"

import {
  ListCard,
  ListCardEmpty,
  ListCardHeader,
  ListCardHeaderAction,
  ListCardItem,
  ListCardItemAction,
  ListCardItemActions,
  ListCardItemContent,
  ListCardItems,
  ListCardTitle,
} from "@/components/list-card"
import { ItemTitle } from "@/components/ui/item"

import { useVolumes } from "./hooks"
import { useUnmountVolumeAlertDialog } from "./unmount-volume-dialog"

interface VolumesListCardProps {
  projectName: string
  serviceName: string
  initialData: Record<string, string>
}

export function VolumesListCard({
  projectName,
  serviceName,
  initialData,
}: VolumesListCardProps) {
  const { data: volumes = {} } = useVolumes(
    projectName,
    serviceName,
    initialData
  )
  const openUnmountDialog = useUnmountVolumeAlertDialog(
    projectName,
    serviceName
  )

  const items = Object.entries(volumes)

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Volumes</ListCardTitle>
        <ListCardHeaderAction onClick={() => {}}>
          <PlusIcon /> Add volume
        </ListCardHeaderAction>
      </ListCardHeader>

      {items.length === 0 && (
        <ListCardEmpty>No volumes configured</ListCardEmpty>
      )}
      {items.length > 0 && (
        <ListCardItems>
          {items.map(([hostPath, containerPath]) => (
            <ListCardItem key={hostPath}>
              <ListCardItemContent>
                <ItemTitle className="w-full font-mono">
                  <span className="truncate">{hostPath}</span>
                  <span>:</span>
                  <span className="truncate text-muted-foreground">
                    {containerPath}
                  </span>
                </ItemTitle>
              </ListCardItemContent>
              <ListCardItemActions>
                <ListCardItemAction
                  onClick={() => openUnmountDialog(hostPath, containerPath)}
                >
                  <CircleMinusIcon />
                </ListCardItemAction>
              </ListCardItemActions>
            </ListCardItem>
          ))}
        </ListCardItems>
      )}
    </ListCard>
  )
}

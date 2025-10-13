"use client"

import { use } from "react"
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
  ListCardSkeleton,
  ListCardTitle,
} from "@/components/list-card"
import { ItemTitle } from "@/components/ui/item"

import { useVolumes } from "./hooks"
import { useUnmountVolumeAlertDialog } from "./unmount-volume-dialog"

interface VolumesPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default function VolumesPage({ params }: VolumesPageProps) {
  const { projectName, serviceName } = use(params)
  const { data: volumes, isLoading } = useVolumes(projectName, serviceName)
  const openUnmountDialog = useUnmountVolumeAlertDialog(
    projectName,
    serviceName
  )

  const items = Object.entries(volumes || {})

  return (
    <ListCard isLoading={isLoading} itemCount={items.length}>
      <ListCardHeader>
        <ListCardTitle>Volumes</ListCardTitle>
        <ListCardHeaderAction onClick={() => {}}>
          <PlusIcon /> Add volume
        </ListCardHeaderAction>
      </ListCardHeader>

      <ListCardSkeleton />

      <ListCardEmpty>No volumes configured</ListCardEmpty>

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
    </ListCard>
  )
}

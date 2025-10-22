"use client"

import { PlayIcon, RefreshCwIcon, SquareIcon } from "lucide-react"

import {
  ListCardItem,
  ListCardItemAction,
  ListCardItemActions,
  ListCardItemContent,
} from "@/components/list-card"
import { StatusIcon, StatusText } from "@/components/status"
import { ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import type { ServiceType } from "@/types"

import { useRestartService, useStartService, useStopService } from "./hooks"

interface OverviewStatusProps {
  type: ServiceType
  projectName: string
  serviceName: string
  running: boolean
  deployed: boolean
}

export function OverviewStatus({
  type,
  projectName,
  serviceName,
  running,
  deployed,
}: OverviewStatusProps) {
  const startService = useStartService(type, projectName, serviceName)
  const stopService = useStopService(type, projectName, serviceName)
  const restartService = useRestartService(type, projectName, serviceName)

  const disabled =
    startService.isPending || stopService.isPending || restartService.isPending

  return (
    <ListCardItem>
      <ItemMedia variant="icon" className="size-10">
        <StatusIcon running={running} deployed={deployed} />
      </ItemMedia>
      <ListCardItemContent>
        <ItemTitle>Status</ItemTitle>
        <ItemDescription>
          <StatusText running={running} deployed={deployed} />
        </ItemDescription>
      </ListCardItemContent>
      <ListCardItemActions>
        {!running ? (
          <ListCardItemAction
            onClick={() => startService.mutate()}
            disabled={disabled}
            className="text-green-500"
          >
            {startService.isPending ? <Spinner /> : <PlayIcon />}
          </ListCardItemAction>
        ) : (
          <>
            <ListCardItemAction
              onClick={() => stopService.mutate()}
              disabled={disabled}
              className="text-red-500"
            >
              {stopService.isPending ? <Spinner /> : <SquareIcon />}
            </ListCardItemAction>
            <ListCardItemAction
              onClick={() => restartService.mutate()}
              disabled={disabled}
              className="text-sky-500"
            >
              {restartService.isPending ? <Spinner /> : <RefreshCwIcon />}
            </ListCardItemAction>
          </>
        )}
      </ListCardItemActions>
    </ListCardItem>
  )
}

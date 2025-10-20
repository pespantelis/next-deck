"use client"

import {
  CopyIcon,
  EarthIcon,
  HatGlassesIcon,
  LinkIcon,
  PencilIcon,
  PlayIcon,
  RefreshCwIcon,
  ServerIcon,
  SquareIcon,
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
import { StatusIcon, StatusText } from "@/components/status"
import { ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

import { useEditPortDialog } from "./edit-port-dialog"
import {
  useOverview,
  useRestartService,
  useStartService,
  useStopService,
  useToggleVisibility,
} from "./hooks"

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

  const startService = useStartService(projectName, serviceName)
  const stopService = useStopService(projectName, serviceName)
  const restartService = useRestartService(projectName, serviceName)

  const internalEndpoint = `http://${overview.alias}:${overview.port}`

  const copyInternalEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(internalEndpoint)
      toast.success("Endpoint copied to clipboard")
    } catch {
      toast.error("Failed to copy endpoint")
    }
  }

  const disabled =
    startService.isPending || stopService.isPending || restartService.isPending

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Overview</ListCardTitle>
      </ListCardHeader>

      <ListCardItems>
        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <StatusIcon
              running={overview.running}
              deployed={overview.deployed}
            />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Status</ItemTitle>
            <ItemDescription>
              <StatusText
                running={overview.running}
                deployed={overview.deployed}
              />
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            {!overview.running ? (
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

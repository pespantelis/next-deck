"use client"

import {
  ArrowUpRightIcon,
  CopyIcon,
  NetworkIcon,
  PlugIcon,
  XIcon,
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
import { Spinner } from "@/components/ui/spinner"
import type { DatabaseType } from "@/types"

import { useOverview, useToggleExpose } from "./hooks"

interface OverviewCardProps {
  projectName: string
  serviceName: string
  dbType: DatabaseType
  initialData: {
    dsn: string
    exposed: string | null
    running: boolean
    deployed: boolean
  }
}

export function OverviewCard({
  projectName,
  serviceName,
  dbType,
  initialData,
}: OverviewCardProps) {
  const { data: overview = initialData } = useOverview(
    projectName,
    serviceName,
    dbType
  )
  const toggleExpose = useToggleExpose(projectName, serviceName, dbType)

  const copyConnectionString = async () => {
    try {
      await navigator.clipboard.writeText(overview.dsn)
      toast.success("Connection string copied to clipboard.")
    } catch {
      toast.error("Failed to copy connection string.")
    }
  }

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Overview</ListCardTitle>
      </ListCardHeader>

      <ListCardItems>
        <OverviewStatus
          type={dbType}
          projectName={projectName}
          serviceName={serviceName}
          running={overview.running}
          deployed={overview.deployed}
        />

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <NetworkIcon
              className={overview.exposed ? "text-yellow-500" : undefined}
            />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Network access</ItemTitle>
            <ItemDescription>
              {overview.exposed || "Not accessible"}
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction
              onClick={() => toggleExpose.mutate()}
              disabled={toggleExpose.isPending}
            >
              {toggleExpose.isPending ? (
                <Spinner />
              ) : overview.exposed ? (
                <XIcon />
              ) : (
                <ArrowUpRightIcon />
              )}
            </ListCardItemAction>
          </ListCardItemActions>
        </ListCardItem>

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <PlugIcon />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Connection string</ItemTitle>
            <ItemDescription className="flex w-full">
              <span className="truncate">
                {overview.dsn || "Not available"}
              </span>
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction onClick={copyConnectionString}>
              <CopyIcon />
            </ListCardItemAction>
          </ListCardItemActions>
        </ListCardItem>
      </ListCardItems>
    </ListCard>
  )
}

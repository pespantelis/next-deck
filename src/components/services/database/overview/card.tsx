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
import type { Data } from "./types"

interface OverviewCardProps {
  projectName: string
  serviceName: string
  dbType: DatabaseType
  initialData: Data
}

export function OverviewCard({
  projectName,
  serviceName,
  dbType,
  initialData,
}: OverviewCardProps) {
  const { data } = useOverview(projectName, serviceName, dbType, initialData)
  const toggleExpose = useToggleExpose(projectName, serviceName, dbType)

  const copyConnectionString = async () => {
    try {
      await navigator.clipboard.writeText(data.dsn)
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
          running={data.running}
          deployed={data.deployed}
        />

        <ListCardItem>
          <ItemMedia variant="icon" className="size-10">
            <NetworkIcon
              className={data.exposed ? "text-yellow-500" : undefined}
            />
          </ItemMedia>
          <ListCardItemContent>
            <ItemTitle>Network access</ItemTitle>
            <ItemDescription>
              {data.exposed || "Not accessible"}
            </ItemDescription>
          </ListCardItemContent>
          <ListCardItemActions>
            <ListCardItemAction
              onClick={() => toggleExpose.mutate()}
              disabled={toggleExpose.isPending}
            >
              {toggleExpose.isPending ? (
                <Spinner />
              ) : data.exposed ? (
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
              <span className="truncate">{data.dsn || "Not available"}</span>
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

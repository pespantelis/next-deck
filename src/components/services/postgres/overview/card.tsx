"use client"

import { CopyIcon, PlugIcon } from "lucide-react"
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

import { useOverview } from "./hooks"

interface OverviewCardProps {
  projectName: string
  serviceName: string
  initialData: {
    dsn: string
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
          type="postgres"
          projectName={projectName}
          serviceName={serviceName}
          running={overview.running}
          deployed={overview.deployed}
        />

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

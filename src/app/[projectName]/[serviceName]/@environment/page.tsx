"use client"

import { use } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

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

import { useDeleteEnvironmentVariableAlertDialog } from "./delete-environment-variable-dialog"
import { useEnvironmentVariables } from "./hooks"
import { useSaveEnvironmentVariableDialog } from "./save-environment-variable-dialog"

interface EnvironmentPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default function EnvironmentPage({ params }: EnvironmentPageProps) {
  const { projectName, serviceName } = use(params)
  const { data: env, isLoading } = useEnvironmentVariables(
    projectName,
    serviceName
  )
  const openSaveDialog = useSaveEnvironmentVariableDialog(
    projectName,
    serviceName
  )
  const openDeleteDialog = useDeleteEnvironmentVariableAlertDialog(
    projectName,
    serviceName
  )

  const items = Object.entries(env || {})

  return (
    <ListCard isLoading={isLoading} itemCount={items.length}>
      <ListCardHeader>
        <ListCardTitle>Environment variables</ListCardTitle>
        <ListCardHeaderAction onClick={() => openSaveDialog()}>
          <PlusIcon /> Add variable
        </ListCardHeaderAction>
      </ListCardHeader>

      <ListCardSkeleton />

      <ListCardEmpty>No environment variables configured</ListCardEmpty>

      <ListCardItems>
        {items.map(([key, value]) => (
          <ListCardItem key={key}>
            <ListCardItemContent>
              <ItemTitle className="w-full font-mono">
                <span className="truncate">{key}</span>
                <span>=</span>
                <span className="truncate text-muted-foreground">{value}</span>
              </ItemTitle>
            </ListCardItemContent>
            <ListCardItemActions>
              <ListCardItemAction
                onClick={() => openSaveDialog({ key, value })}
              >
                <PencilIcon />
              </ListCardItemAction>
              <ListCardItemAction onClick={() => openDeleteDialog(key)}>
                <Trash2Icon />
              </ListCardItemAction>
            </ListCardItemActions>
          </ListCardItem>
        ))}
      </ListCardItems>
    </ListCard>
  )
}

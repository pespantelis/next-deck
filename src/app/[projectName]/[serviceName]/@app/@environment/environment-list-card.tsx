"use client"

import { useCallback } from "react"
import {
  ClipboardListIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

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
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

import { useDeleteEnvironmentVariableAlertDialog } from "./delete-environment-variable-dialog"
import { useEnvironmentVariables, useImportEnvironmentVariables } from "./hooks"
import { useSaveEnvironmentVariableDialog } from "./save-environment-variable-dialog"

interface EnvironmentListCardProps {
  projectName: string
  serviceName: string
  initialData: Record<string, string>
}

export function EnvironmentListCard({
  projectName,
  serviceName,
  initialData,
}: EnvironmentListCardProps) {
  const { data: environment = {} } = useEnvironmentVariables(
    projectName,
    serviceName,
    initialData
  )
  const openSaveDialog = useSaveEnvironmentVariableDialog(
    projectName,
    serviceName
  )
  const openDeleteDialog = useDeleteEnvironmentVariableAlertDialog(
    projectName,
    serviceName
  )

  const { mutate: importFromClipboard, isPending: isImporting } =
    useImportEnvironmentVariables(projectName, serviceName)

  const handleImportFromClipboard = useCallback(async () => {
    const input = await navigator.clipboard.readText()

    return importFromClipboard(input)
  }, [importFromClipboard])

  const items = Object.entries(environment)

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Environment variables</ListCardTitle>
        <ButtonGroup>
          <ListCardHeaderAction
            disabled={isImporting}
            onClick={() => openSaveDialog()}
          >
            <PlusIcon /> Add variable
          </ListCardHeaderAction>
          <ButtonGroupSeparator />
          <ListCardHeaderAction
            disabled={isImporting}
            onClick={handleImportFromClipboard}
          >
            {isImporting ? <Spinner /> : <ClipboardListIcon />}
          </ListCardHeaderAction>
        </ButtonGroup>
      </ListCardHeader>

      {items.length === 0 && (
        <ListCardEmpty>No environment variables configured</ListCardEmpty>
      )}

      {items.length > 0 && (
        <ListCardItems>
          {items.map(([key, value]) => (
            <ListCardItem key={key}>
              <ListCardItemContent>
                <ItemTitle className="w-full font-mono">
                  <span className="truncate">{key}</span>
                  <span>=</span>
                  <span className="truncate text-muted-foreground">
                    {value}
                  </span>
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
      )}
    </ListCard>
  )
}

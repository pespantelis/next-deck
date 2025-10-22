"use client"

import {
  AlertDialogActionButton,
  useAlertDialog,
} from "@/components/alert-dialog"
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useDeleteEnvironmentVariable } from "./hooks"

export function useDeleteEnvironmentVariableAlertDialog(
  projectName: string,
  serviceName: string
) {
  const { open } = useAlertDialog()

  return (key: string) => {
    open(
      <Content
        projectName={projectName}
        serviceName={serviceName}
        envKey={key}
      />
    )
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
  envKey: string
}

function Content({ projectName, serviceName, envKey }: ContentProps) {
  const { close } = useAlertDialog()

  const { mutate, isPending } = useDeleteEnvironmentVariable(
    projectName,
    serviceName,
    close
  )

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete environment variable</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete the environment variable{" "}
          <strong>{envKey}</strong>?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <AlertDialogActionButton
          isLoading={isPending}
          onClick={() => mutate(envKey)}
        >
          Delete
        </AlertDialogActionButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

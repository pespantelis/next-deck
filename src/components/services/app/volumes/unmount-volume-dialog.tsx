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

import { useUnmountVolume } from "./hooks"

export function useUnmountVolumeAlertDialog(
  projectName: string,
  serviceName: string
) {
  const { open } = useAlertDialog()

  return (hostPath: string, containerPath: string) => {
    open(
      <Content
        projectName={projectName}
        serviceName={serviceName}
        hostPath={hostPath}
        containerPath={containerPath}
      />
    )
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
  hostPath: string
  containerPath: string
}

function Content({
  projectName,
  serviceName,
  hostPath,
  containerPath,
}: ContentProps) {
  const { close } = useAlertDialog()

  const { mutate, isPending } = useUnmountVolume(
    projectName,
    serviceName,
    close
  )

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Unmount volume</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to unmount the volume{" "}
          <strong>
            {hostPath} → {containerPath}
          </strong>
          ?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <AlertDialogActionButton
          isLoading={isPending}
          onClick={() => mutate({ hostPath, containerPath })}
        >
          Unmount
        </AlertDialogActionButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

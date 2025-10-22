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

import { useDeleteDomain } from "./hooks"

export function useDeleteDomainAlertDialog(
  projectName: string,
  serviceName: string
) {
  const { open } = useAlertDialog()

  return (domain: string) => {
    open(
      <Content
        projectName={projectName}
        serviceName={serviceName}
        domain={domain}
      />
    )
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
  domain: string
}

function Content({ projectName, serviceName, domain }: ContentProps) {
  const { close } = useAlertDialog()

  const { mutate, isPending } = useDeleteDomain(projectName, serviceName, close)

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete domain</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete the domain <strong>{domain}</strong>?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <AlertDialogActionButton
          isLoading={isPending}
          onClick={() => mutate(domain)}
        >
          Delete
        </AlertDialogActionButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

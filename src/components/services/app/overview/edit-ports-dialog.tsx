"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { DialogCancelButton, useDialog } from "@/components/dialog"
import { InputFieldControl } from "@/components/input-field-control"
import { SubmitButton } from "@/components/submit-button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"

import { useUpdatePorts } from "./hooks"

const formSchema = z.object({
  ports: z
    .string()
    .min(1, "Required")
    .regex(
      /^(\d+|[a-z]+:\d+:\d+)(\s+(\d+|[a-z]+:\d+:\d+))*$/,
      "Should be <port> or <scheme>:<port>:<container-port>"
    ),
})

type FormData = z.infer<typeof formSchema>

type PortsData = {
  ports: string
}

export function useEditPortsDialog(projectName: string, serviceName: string) {
  const { open } = useDialog()

  return (portsData: PortsData) => {
    open(
      <Content
        projectName={projectName}
        serviceName={serviceName}
        portsData={portsData}
      />
    )
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
  portsData: PortsData
}

function Content({ projectName, serviceName, portsData }: ContentProps) {
  const { close } = useDialog()

  const { mutate, isPending } = useUpdatePorts(projectName, serviceName, close)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: portsData,
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit container ports</DialogTitle>
        <DialogDescription>
          Update the ports for the <strong>{serviceName}</strong> service.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FieldGroup>
          <InputFieldControl
            control={form.control}
            name="ports"
            label="Ports"
            placeholder="https:443:5000"
            autoComplete="off"
            autoFocus
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>Update ports</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

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

import { useUpdatePort } from "./hooks"

const formSchema = z.object({
  port: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be a number"),
})

type FormData = z.infer<typeof formSchema>

type PortData = {
  port: string
}

export function useEditPortDialog(projectName: string, serviceName: string) {
  const { open } = useDialog()

  return (portData: PortData) => {
    open(
      <Content
        projectName={projectName}
        serviceName={serviceName}
        portData={portData}
      />
    )
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
  portData: PortData
}

function Content({ projectName, serviceName, portData }: ContentProps) {
  const { close } = useDialog()

  const { mutate, isPending } = useUpdatePort(projectName, serviceName, close)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: portData,
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit container port</DialogTitle>
        <DialogDescription>
          Update the port for the <strong>{serviceName}</strong> service.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FieldGroup>
          <InputFieldControl
            control={form.control}
            name="port"
            label="Port"
            placeholder="3000"
            autoComplete="off"
            autoFocus
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>Update port</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

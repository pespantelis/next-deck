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

import { useAddDomain } from "./hooks"

const formSchema = z.object({
  domain: z
    .string()
    .min(1, "Required")
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Please enter a valid domain name"
    ),
})

type FormData = z.infer<typeof formSchema>

export function useAddDomainDialog(projectName: string, serviceName: string) {
  const { open } = useDialog()

  return () => {
    open(<Content projectName={projectName} serviceName={serviceName} />)
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
}

function Content({ projectName, serviceName }: ContentProps) {
  const { close } = useDialog()

  const { mutate, isPending } = useAddDomain(projectName, serviceName, close)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      domain: "",
    },
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add domain</DialogTitle>
        <DialogDescription>
          Add a new domain to <strong>{serviceName}</strong>.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit((data) => mutate(data.domain))}>
        <FieldGroup>
          <InputFieldControl
            control={form.control}
            name="domain"
            label="Domain"
            placeholder="example.com"
            autoComplete="off"
            autoFocus
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>Add domain</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

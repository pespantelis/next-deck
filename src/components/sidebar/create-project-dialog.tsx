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

import { useCreateProject } from "./hooks"

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Should type a name")
    .regex(/^[a-zA-Z0-9]/, "Should start with a letter or number")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Should only contain letters, numbers, underscores, dots, and hyphens"
    ),
})

type FormData = z.infer<typeof formSchema>

export function useCreateProjectDialog() {
  const { open } = useDialog()

  return (onProjectCreated: (projectName: string) => void) => {
    open(<Content onProjectCreated={onProjectCreated} />)
  }
}

interface ContentProps {
  onProjectCreated: (projectName: string) => void
}

function Content({ onProjectCreated }: ContentProps) {
  const { close } = useDialog()

  const { mutate, isPending } = useCreateProject((name) => {
    close()
    onProjectCreated(name)
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
    },
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add project</DialogTitle>
        <DialogDescription>
          Create a new project to organize your services.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FieldGroup>
          <InputFieldControl
            control={form.control}
            name="name"
            label="Project name"
            placeholder="my-project"
            autoComplete="off"
            autoFocus
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>Create project</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

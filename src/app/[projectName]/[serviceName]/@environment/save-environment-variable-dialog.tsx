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

import { useSetEnvironmentVariable } from "./hooks"

const formSchema = z.object({
  key: z
    .string()
    .min(1, "Required")
    .regex(
      /^[A-Z_][A-Z0-9_]*$/,
      "Should be uppercase letters, numbers, and underscores only"
    ),
  value: z.string().min(1, "Required"),
})

type FormData = z.infer<typeof formSchema>

type EnvironmentVariable = {
  key: string
  value: string
}

export function useSaveEnvironmentVariableDialog(
  projectName: string,
  serviceName: string
) {
  const { open } = useDialog()

  return (envVar?: EnvironmentVariable) => {
    open(
      <Content
        projectName={projectName}
        serviceName={serviceName}
        envVar={envVar}
      />
    )
  }
}

interface ContentProps {
  projectName: string
  serviceName: string
  envVar?: EnvironmentVariable
}

function Content({ projectName, serviceName, envVar }: ContentProps) {
  const { close } = useDialog()

  const { mutate, isPending } = useSetEnvironmentVariable(
    projectName,
    serviceName,
    close
  )

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: envVar ?? {
      key: "",
      value: "",
    },
  })

  const isEditMode = !!envVar

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {isEditMode ? "Edit" : "Add"} environment variable
        </DialogTitle>
        <DialogDescription>
          {isEditMode ? (
            "Update the environment variable value."
          ) : (
            <>
              Add a new environment variable to <strong>{serviceName}</strong>.
            </>
          )}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FieldGroup>
          <InputFieldControl
            control={form.control}
            name="key"
            label="Key"
            placeholder="DATABASE_URL"
            autoComplete="off"
            autoFocus={!isEditMode}
            readOnly={isEditMode}
          />

          <InputFieldControl
            control={form.control}
            name="value"
            label="Value"
            placeholder="postgresql://..."
            autoComplete="off"
            autoFocus={isEditMode}
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>
            {isEditMode ? "Update" : "Add"} variable
          </SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

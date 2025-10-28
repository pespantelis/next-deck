"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

import { useMountVolume } from "./hooks"

const formSchema = z.object({
  hostPath: z
    .string()
    .min(1, "Required")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Should be letters, numbers, underscores, and hyphens only"
    ),
  containerPath: z
    .string()
    .min(1, "Required")
    .regex(/^\//, "Should be an absolute path"),
})

type FormData = z.infer<typeof formSchema>

export function useAddVolumeDialog(projectName: string, serviceName: string) {
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

  const { mutate, isPending } = useMountVolume(projectName, serviceName, close)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      hostPath: "",
      containerPath: "",
    },
  })

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add volume</DialogTitle>
        <DialogDescription>
          Mount a new volume to <strong>{serviceName}</strong>.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FieldGroup>
          <Controller
            name="hostPath"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="host-path">Host path</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>
                      /var/lib/dokku/data/storage/
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="host-path"
                    aria-invalid={fieldState.invalid}
                    placeholder="my-app-data"
                    autoComplete="off"
                    {...field}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <InputFieldControl
            control={form.control}
            name="containerPath"
            label="Container path"
            placeholder="/app/storage"
            autoComplete="off"
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>Add volume</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

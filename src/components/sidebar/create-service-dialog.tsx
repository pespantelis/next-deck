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
import type { ServiceCreatedCallback, ServiceType } from "@/types"

import {
  createAppService,
  createMongoService,
  createPostgresService,
} from "./actions"
import { useCreateService } from "./hooks"

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

export function useCreateAppServiceDialog() {
  const { open } = useDialog()

  return (projectName: string, onServiceCreated: ServiceCreatedCallback) => {
    open(
      <Content
        serviceType="app"
        projectName={projectName}
        mutationFn={createAppService}
        onServiceCreated={onServiceCreated}
      />
    )
  }
}

export function useCreatePostgresServiceDialog() {
  const { open } = useDialog()

  return (projectName: string, onServiceCreated: ServiceCreatedCallback) => {
    open(
      <Content
        serviceType="postgres"
        projectName={projectName}
        mutationFn={createPostgresService}
        onServiceCreated={onServiceCreated}
      />
    )
  }
}

export function useCreateMongoServiceDialog() {
  const { open } = useDialog()

  return (projectName: string, onServiceCreated: ServiceCreatedCallback) => {
    open(
      <Content
        serviceType="mongo"
        projectName={projectName}
        mutationFn={createMongoService}
        onServiceCreated={onServiceCreated}
      />
    )
  }
}

interface ContentProps {
  serviceType: ServiceType
  projectName: string
  mutationFn: (projectName: string, serviceName: string) => Promise<void>
  onServiceCreated: ServiceCreatedCallback
}

function Content({
  mutationFn,
  serviceType,
  projectName,
  onServiceCreated,
}: ContentProps) {
  const { close } = useDialog()

  const { mutate, isPending } = useCreateService(
    serviceType,
    mutationFn,
    (serviceName) => {
      close()
      onServiceCreated(serviceName)
    }
  )

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
        <DialogTitle>Add {serviceType} service</DialogTitle>
        <DialogDescription>
          Create a new {serviceType} service in the{" "}
          <strong>{projectName}</strong> project.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit(({ name: serviceName }) =>
          mutate({ projectName, serviceName })
        )}
      >
        <FieldGroup>
          <InputFieldControl
            control={form.control}
            name="name"
            label="Service name"
            placeholder={`my-${serviceType}-service`}
            autoComplete="off"
            autoFocus
          />
        </FieldGroup>

        <DialogFooter className="mt-6">
          <DialogCancelButton isLoading={isPending}>Cancel</DialogCancelButton>
          <SubmitButton isLoading={isPending}>Create service</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

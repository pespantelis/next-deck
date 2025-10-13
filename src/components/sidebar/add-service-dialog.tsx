"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { CancelButton } from "@/components/cancel-button"
import { SubmitButton } from "@/components/submit-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { useCreateService } from "./hooks"

type AddServiceDialogProps = {
  open: boolean
  onClose: () => void
  projectName: string
}

export function AddServiceDialog({
  open,
  onClose,
  projectName,
}: AddServiceDialogProps) {
  const [name, setName] = useState("")
  const router = useRouter()

  const mutation = useCreateService((serviceName) => {
    onClose()
    setName("")
    router.push(`/${projectName}/${serviceName}`)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ projectName, serviceName: name.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add service</DialogTitle>
          <DialogDescription>
            Create a new service in {projectName} project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Service name
              </label>
              <Input
                id="name"
                placeholder="my-service"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={mutation.isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <CancelButton disabled={mutation.isPending} onClick={onClose} />
            <SubmitButton disabled={!name.trim()} loading={mutation.isPending}>
              Create service
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

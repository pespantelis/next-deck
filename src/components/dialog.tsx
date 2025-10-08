"use client"

import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose } from "@/components/ui/dialog"

type DialogContextType = {
  open: (content: React.ReactNode) => void
  close: () => void
}

const DialogContext = createContext<DialogContextType | null>(null)

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider")
  }
  return context
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(null)
  const [key, setKey] = useState(0)

  const open = useCallback((newContent: React.ReactNode) => {
    setKey((prev) => prev + 1)
    setContent(newContent)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <DialogContext.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Fragment key={key}>{content}</Fragment>
      </Dialog>
    </DialogContext.Provider>
  )
}

interface DialogCancelButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "disabled"> {
  isLoading: boolean
}

export function DialogCancelButton({
  children,
  isLoading,
  variant = "outline",
  ...props
}: DialogCancelButtonProps) {
  return (
    <DialogClose asChild>
      <Button variant={variant} disabled={isLoading} {...props}>
        {children}
      </Button>
    </DialogClose>
  )
}

"use client"

import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useState,
} from "react"

import { AlertDialog, AlertDialogAction } from "@/components/ui/alert-dialog"

import { SubmitButton } from "./submit-button"

type AlertDialogContextType = {
  open: (content: React.ReactNode) => void
  close: () => void
}

const AlertDialogContext = createContext<AlertDialogContextType | null>(null)

export function useAlertDialog() {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider")
  }
  return context
}

export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
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
    <AlertDialogContext.Provider value={{ open, close }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <Fragment key={key}>{content}</Fragment>
      </AlertDialog>
    </AlertDialogContext.Provider>
  )
}

export function AlertDialogActionButton({
  children,
  variant = "destructive",
  ...props
}: React.ComponentProps<typeof SubmitButton>) {
  return (
    <AlertDialogAction onClick={(e) => e.preventDefault()} asChild>
      <SubmitButton variant={variant} {...props}>
        {children}
      </SubmitButton>
    </AlertDialogAction>
  )
}

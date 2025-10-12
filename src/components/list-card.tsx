import { createContext, useContext } from "react"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

interface ListCardContext {
  isLoading: boolean
  itemCount: number
}

const ListCardContext = createContext<ListCardContext | undefined>(undefined)

function useListCardContext() {
  const context = useContext(ListCardContext)
  if (!context) {
    throw new Error("ListCard components must be used within ListCard")
  }
  return context
}

interface ListCardProps {
  isLoading: boolean
  itemCount: number
  children: React.ReactNode
}

export function ListCard({ isLoading, itemCount, children }: ListCardProps) {
  return (
    <ListCardContext.Provider value={{ isLoading, itemCount }}>
      <div className="rounded-lg border bg-card p-6">{children}</div>
    </ListCardContext.Provider>
  )
}

export function ListCardSkeleton() {
  const { isLoading } = useListCardContext()

  if (!isLoading) {
    return null
  }

  return (
    <div className="space-y-2">
      <Skeleton className="h-[52px] w-full" />
      <Skeleton className="h-[52px] w-full" />
      <Skeleton className="h-[52px] w-full" />
    </div>
  )
}

export function ListCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">{children}</div>
  )
}

export function ListCardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>
}

export function ListCardHeaderAction({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      {children}
    </Button>
  )
}

export function ListCardEmpty({ children }: { children: React.ReactNode }) {
  const { isLoading, itemCount } = useListCardContext()

  if (isLoading || itemCount > 0) {
    return null
  }

  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
  )
}

export function ListCardItems({ children }: { children: React.ReactNode }) {
  const { isLoading, itemCount } = useListCardContext()

  if (isLoading || itemCount === 0) {
    return null
  }

  return <ItemGroup className="gap-2">{children}</ItemGroup>
}

export function ListCardItem({ children }: { children: React.ReactNode }) {
  return (
    <Item variant="outline" size="sm">
      {children}
    </Item>
  )
}

export function ListCardItemContent({
  children,
}: {
  children: React.ReactNode
}) {
  return <ItemContent className="min-w-0">{children}</ItemContent>
}

export function ListCardItemActions({
  children,
}: {
  children: React.ReactNode
}) {
  return <ItemActions>{children}</ItemActions>
}

interface ListCardItemActionProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

export function ListCardItemAction({
  onClick,
  children,
  disabled,
}: ListCardItemActionProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  )
}

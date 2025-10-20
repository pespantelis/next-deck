"use client"

import { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ListCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card p-6">{children}</div>
}

export function ListCardSkeleton({
  className,
  count,
  showAction = false,
}: {
  className?: string
  count: number
  showAction?: boolean
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-2/4" />
        {showAction && <Skeleton className="h-8 w-1/4" />}
      </div>
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} className={cn("h-15.5 w-full", className)} />
        ))}
      </div>
    </div>
  )
}

export function ListCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex h-8 items-center justify-between">{children}</div>
  )
}

export function ListCardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>
}

export function ListCardHeaderAction(props: ComponentProps<typeof Button>) {
  return <Button variant="outline" size="sm" {...props} />
}

export function ListCardEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
  )
}

export function ListCardItems({ children }: { children: React.ReactNode }) {
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
    <Button
      variant="secondary"
      size="icon"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

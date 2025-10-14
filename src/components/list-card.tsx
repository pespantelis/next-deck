"use client"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

export function ListCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card p-6">{children}</div>
}

export function ListCardSkeleton({ count }: { count: number }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-2/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} className="h-15.5 w-full" />
        ))}
      </div>
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
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      {children}
    </Button>
  )
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
    <Button variant="ghost" size="icon" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  )
}

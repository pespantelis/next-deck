"use client"

import { use } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import {
  ListCard,
  ListCardEmpty,
  ListCardHeader,
  ListCardHeaderAction,
  ListCardItem,
  ListCardItemAction,
  ListCardItemActions,
  ListCardItemContent,
  ListCardItems,
  ListCardSkeleton,
  ListCardTitle,
} from "@/components/list-card"
import { ItemTitle } from "@/components/ui/item"

import { useDomains } from "./hooks"

interface DomainsPageProps {
  params: Promise<{
    projectName: string
    serviceName: string
  }>
}

export default function DomainsPage({ params }: DomainsPageProps) {
  const { projectName, serviceName } = use(params)
  const { data: domains, isLoading } = useDomains(projectName, serviceName)

  const items = domains || []

  return (
    <ListCard isLoading={isLoading} itemCount={items.length}>
      <ListCardHeader>
        <ListCardTitle>Domains</ListCardTitle>
        <ListCardHeaderAction onClick={() => {}}>
          <PlusIcon /> Add domain
        </ListCardHeaderAction>
      </ListCardHeader>

      <ListCardSkeleton />

      <ListCardEmpty>No domains configured</ListCardEmpty>

      <ListCardItems>
        {items.map((domain) => (
          <ListCardItem key={domain}>
            <ListCardItemContent>
              <ItemTitle className="w-full font-mono">
                <span className="truncate">{domain}</span>
              </ItemTitle>
            </ListCardItemContent>
            <ListCardItemActions>
              <ListCardItemAction onClick={() => {}}>
                <Trash2Icon />
              </ListCardItemAction>
            </ListCardItemActions>
          </ListCardItem>
        ))}
      </ListCardItems>
    </ListCard>
  )
}

"use client"

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
  ListCardTitle,
} from "@/components/list-card"
import { ItemTitle } from "@/components/ui/item"

import { useDeleteDomainAlertDialog } from "./delete-domain-dialog"
import { useDomains } from "./hooks"

interface DomainsListCardProps {
  projectName: string
  serviceName: string
  initialData: string[]
}

export function DomainsListCard({
  projectName,
  serviceName,
  initialData,
}: DomainsListCardProps) {
  const { data: domains = [] } = useDomains(
    projectName,
    serviceName,
    initialData
  )
  const openDeleteDialog = useDeleteDomainAlertDialog(projectName, serviceName)

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Domains</ListCardTitle>
        <ListCardHeaderAction onClick={() => {}}>
          <PlusIcon /> Add domain
        </ListCardHeaderAction>
      </ListCardHeader>

      {domains.length === 0 && (
        <ListCardEmpty>No domains configured</ListCardEmpty>
      )}

      {domains.length > 0 && (
        <ListCardItems>
          {domains.map((domain) => (
            <ListCardItem key={domain}>
              <ListCardItemContent>
                <ItemTitle className="w-full font-mono">
                  <span className="truncate">{domain}</span>
                </ItemTitle>
              </ListCardItemContent>
              <ListCardItemActions>
                <ListCardItemAction onClick={() => openDeleteDialog(domain)}>
                  <Trash2Icon />
                </ListCardItemAction>
              </ListCardItemActions>
            </ListCardItem>
          ))}
        </ListCardItems>
      )}
    </ListCard>
  )
}

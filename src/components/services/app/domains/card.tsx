"use client"

import {
  LockIcon,
  PlusIcon,
  RefreshCcwIcon,
  Trash2Icon,
  UnlockIcon,
} from "lucide-react"

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
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

import { useAddDomainDialog } from "./add-domain-dialog"
import { useDeleteDomainAlertDialog } from "./delete-domain-dialog"
import { useDomains, useEnableLetsEncrypt } from "./hooks"
import type { Data } from "./types"

interface DomainsCardProps {
  projectName: string
  serviceName: string
  initialData: Data
}

export function DomainsCard({
  projectName,
  serviceName,
  initialData,
}: DomainsCardProps) {
  const { data } = useDomains(projectName, serviceName, initialData)
  const openAddDialog = useAddDomainDialog(projectName, serviceName)
  const openDeleteDialog = useDeleteDomainAlertDialog(projectName, serviceName)

  const enableLetsEncrypt = useEnableLetsEncrypt(projectName, serviceName)

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Domains</ListCardTitle>
        <ButtonGroup>
          <ListCardHeaderAction
            disabled={enableLetsEncrypt.isPending}
            onClick={openAddDialog}
          >
            <PlusIcon /> Add domain
          </ListCardHeaderAction>
          <ButtonGroupSeparator />
          <ListCardHeaderAction
            disabled={enableLetsEncrypt.isPending}
            onClick={() => enableLetsEncrypt.mutate()}
          >
            {enableLetsEncrypt.isPending ? <Spinner /> : <RefreshCcwIcon />}
          </ListCardHeaderAction>
        </ButtonGroup>
      </ListCardHeader>

      {data.domains.length === 0 && (
        <ListCardEmpty>No domains configured</ListCardEmpty>
      )}

      {data.domains.length > 0 && (
        <ListCardItems>
          {data.domains.map((domain) => (
            <ListCardItem key={domain}>
              <ItemMedia variant="icon">
                {data.letsencrypt ? (
                  <LockIcon className="text-blue-500" />
                ) : (
                  <UnlockIcon className="text-yellow-500" />
                )}
              </ItemMedia>
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

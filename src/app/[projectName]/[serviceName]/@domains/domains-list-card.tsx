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

import { useDeleteDomainAlertDialog } from "./delete-domain-dialog"
import { useDomains, useEnableLetsEncrypt } from "./hooks"

interface DomainsListCardProps {
  projectName: string
  serviceName: string
  initialData: { domains: string[]; letsencrypt: boolean }
}

export function DomainsListCard({
  projectName,
  serviceName,
  initialData,
}: DomainsListCardProps) {
  const { data: info = { domains: [], letsencrypt: false } } = useDomains(
    projectName,
    serviceName,
    initialData
  )
  const openDeleteDialog = useDeleteDomainAlertDialog(projectName, serviceName)

  const enableLetsEncrypt = useEnableLetsEncrypt(projectName, serviceName)

  return (
    <ListCard>
      <ListCardHeader>
        <ListCardTitle>Domains</ListCardTitle>
        <ButtonGroup>
          <ListCardHeaderAction
            disabled={enableLetsEncrypt.isPending}
            onClick={() => {}}
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

      {info.domains.length === 0 && (
        <ListCardEmpty>No domains configured</ListCardEmpty>
      )}

      {info.domains.length > 0 && (
        <ListCardItems>
          {info.domains.map((domain) => (
            <ListCardItem key={domain}>
              <ItemMedia variant="icon">
                {info.letsencrypt ? (
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

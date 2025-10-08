"use client"

import { useState } from "react"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { toast } from "sonner"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: false,
            gcTime: 0, // Don't cache errors
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            toast.error("Request failed", {
              description: error.message || "An error occurred",
              duration: 10000,
            })
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error("Request failed", {
              description: error.message || "An error occurred",
              duration: 10000,
            })
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

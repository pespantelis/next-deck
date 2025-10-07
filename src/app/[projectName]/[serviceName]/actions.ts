"use server"

import type { Service } from "@/types"

export async function getService(name: string): Promise<Service> {
  return {
    name,
  }
}

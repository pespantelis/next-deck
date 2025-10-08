import { execSync } from "child_process"

import { env } from "@/lib/env"

function exec(command: string) {
  return execSync(`${env.EXEC_COMMAND} ${command}`, {
    encoding: "utf-8",
  })
}

function read(command: string) {
  return exec(command).split("\n")
}

export const dokku = {
  apps: {
    list: () => read("apps:list"),
  },
  network: {
    list: () => read("network:list"),
  },
}

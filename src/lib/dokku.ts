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

function write(command: string) {
  try {
    exec(command)
  } catch (error: unknown) {
    if (error && typeof error === "object" && "stderr" in error) {
      const stderr = (error.stderr as string)
        .split("\n")
        .filter(Boolean)
        .join("\n")
        .trim()

      if (stderr.startsWith("!")) {
        throw new Error(stderr.slice(1).trim())
      }

      throw new Error(stderr)
    }

    throw error
  }
}

export const dokku = {
  apps: {
    list: () => read("apps:list"),
  },
  network: {
    create: (name: string) => write(`network:create ${name}`),
    list: () => read("network:list"),
  },
}

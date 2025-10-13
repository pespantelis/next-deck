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
    create: (name: string) => write(`apps:create ${name}`),
    list: () => read("apps:list"),
  },
  network: {
    create: (name: string) => write(`network:create ${name}`),
    list: () => read("network:list"),
  },
  config: {
    export: (app: string) => exec(`config:export ${app} --format shell`),
    set: (app: string, key: string, value: string) =>
      write(`config:set --no-restart ${app} ${key}=${value}`),
    unset: (app: string, key: string) =>
      write(`config:unset --no-restart ${app} ${key}`),
  },
  domains: {
    report: (app: string) => exec(`domains:report ${app} --domains-app-vhosts`),
    remove: (app: string, domain: string) =>
      write(`domains:remove ${app} ${domain}`),
  },
  options: {
    add: (app: string, network: string) =>
      write(
        `docker-options:add ${app} deploy,run "--network ${network} --network-alias ${app}"`
      ),
  },
  proxy: {
    disable: (app: string) => write(`proxy:disable ${app}`),
  },
  storage: {
    list: (app: string) => read(`storage:list ${app}`),
    unmount: (app: string, path: string) =>
      write(`storage:unmount ${app} ${path}`),
  },
}

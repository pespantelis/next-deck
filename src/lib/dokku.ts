import { exec } from "child_process"

import { env } from "@/lib/env"

function execAsync(
  command: string
): Promise<{ stdout: string; stderr: string; error: unknown }> {
  return new Promise((resolve) => {
    exec(
      `${env.EXEC_COMMAND} ${command}`,
      { encoding: "utf-8" },
      (error, stdout, stderr) => {
        resolve({ stdout, stderr, error })
      }
    )
  })
}

async function read(command: string) {
  const { stdout } = await execAsync(command)
  return stdout.trim()
}

async function write(command: string) {
  const { stderr, error } = await execAsync(command)

  if (error) {
    const errorMessage = stderr.split("\n").filter(Boolean).join("\n").trim()

    if (errorMessage.startsWith("!")) {
      throw new Error(errorMessage.slice(1).trim())
    }

    throw new Error(errorMessage || "Command failed")
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
    export: (app: string) => read(`config:export ${app} --format shell`),
    set: (app: string, key: string, value: string) =>
      write(`config:set --no-restart ${app} ${key}=${value}`),
    unset: (app: string, key: string) =>
      write(`config:unset --no-restart ${app} ${key}`),
  },
  domains: {
    report: (app: string) => read(`domains:report ${app} --domains-app-vhosts`),
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

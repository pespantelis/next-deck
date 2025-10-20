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
    set: (app: string, network: string) =>
      write(`network:set ${app} attach-post-create ${network}`),
  },
  config: {
    export: (app: string) => read(`config:export ${app} --format envfile`),
    get: (app: string, key: string) => read(`config:get ${app} ${key}`),
    set: (app: string, vars: Record<string, string>) => {
      const pairs = Object.entries(vars)
        .map(([key, value]) => `${key}=\\"${value}\\"`)
        .join(" ")
      return write(`config:set --no-restart ${app} ${pairs}`)
    },
    unset: (app: string, key: string) =>
      write(`config:unset --no-restart ${app} ${key}`),
  },
  domains: {
    report: (app: string) => read(`domains:report ${app} --domains-app-vhosts`),
    remove: (app: string, domain: string) =>
      write(`domains:remove ${app} ${domain}`),
  },
  letsencrypt: {
    active: (app: string) => read(`letsencrypt:active ${app}`),
    enable: (app: string) => write(`letsencrypt:enable ${app}`),
  },
  proxy: {
    disable: (app: string) => write(`proxy:disable ${app}`),
    enable: (app: string) => write(`proxy:enable ${app}`),
    report: (app: string) => read(`proxy:report ${app} --proxy-enabled`),
  },
  ps: {
    report: {
      running: (app = "") => read(`ps:report ${app} --running`),
      deployed: (app = "") => read(`ps:report ${app} --deployed`),
    },
  },
  storage: {
    list: (app: string) => read(`storage:list ${app}`),
    unmount: (app: string, path: string) =>
      write(`storage:unmount ${app} ${path}`),
  },
}

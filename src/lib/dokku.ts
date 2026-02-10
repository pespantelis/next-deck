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

async function read(command: string, suppress = true) {
  const { stdout, error } = await execAsync(command)
  if (error && !suppress) {
    throw error
  }
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
  dockerOptions: {
    build: {
      add: (app: string, option: string) =>
        write(`docker-options:add ${app} build "${option}"`),
      remove: (app: string, option: string) =>
        write(`docker-options:remove ${app} build "${option}"`),
      report: (app: string) =>
        read(`docker-options:report ${app} --docker-options-build`),
    },
  },
  domains: {
    add: (app: string, domain: string) => write(`domains:add ${app} ${domain}`),
    report: (app: string) => read(`domains:report ${app} --domains-app-vhosts`),
    remove: (app: string, domain: string) =>
      write(`domains:remove ${app} ${domain}`),
  },
  letsencrypt: {
    active: (app: string) => read(`letsencrypt:active ${app}`),
    enable: (app: string) => write(`letsencrypt:enable ${app}`),
  },
  ports: {
    report: (app: string) => read(`ports:report ${app}`),
    set: (app: string, ports: string) => write(`ports:set ${app} ${ports}`),
  },
  postgres: {
    create: (name: string, network: string) =>
      write(`postgres:create ${name} -P ${network}`),
    destroy: (name: string) => write(`postgres:destroy ${name}`),
    exists: (name: string) => read(`postgres:exists ${name}`),
    expose: (name: string, port: string) =>
      write(`postgres:expose ${name} ${port}`),
    unexpose: (name: string) => write(`postgres:unexpose ${name}`),
    info: {
      status: (name: string) => read(`postgres:info ${name} --status`),
      dsn: (name: string) => read(`postgres:info ${name} --dsn`),
      exposedPorts: (name: string) =>
        read(`postgres:info ${name} --exposed-ports`),
    },
    link: (service: string, app: string) =>
      write(`postgres:link ${service} ${app} --no-restart`),
    linked: (service: string, app: string) =>
      read(`postgres:linked ${service} ${app}`),
    links: (service: string) => read(`postgres:links ${service}`),
    list: () => read("postgres:list"),
    restart: (name: string) => write(`postgres:restart ${name}`),
    start: (name: string) => write(`postgres:start ${name}`),
    stop: (name: string) => write(`postgres:stop ${name}`),
    unlink: (service: string, app: string) =>
      write(`postgres:unlink ${service} ${app}`),
  },
  mongo: {
    create: (name: string, network: string) =>
      write(`mongo:create ${name} -P ${network}`),
    destroy: (name: string) => write(`mongo:destroy ${name}`),
    exists: (name: string) => read(`mongo:exists ${name}`),
    expose: (name: string, port: string) =>
      write(`mongo:expose ${name} ${port}`),
    unexpose: (name: string) => write(`mongo:unexpose ${name}`),
    info: {
      status: (name: string) => read(`mongo:info ${name} --status`),
      dsn: (name: string) => read(`mongo:info ${name} --dsn`),
      exposedPorts: (name: string) =>
        read(`mongo:info ${name} --exposed-ports`),
    },
    link: (service: string, app: string) =>
      write(`mongo:link ${service} ${app}`),
    linked: (service: string, app: string) =>
      read(`mongo:linked ${service} ${app}`),
    links: (service: string) => read(`mongo:links ${service}`),
    list: () => read("mongo:list"),
    restart: (name: string) => write(`mongo:restart ${name}`),
    start: (name: string) => write(`mongo:start ${name}`),
    stop: (name: string) => write(`mongo:stop ${name}`),
    unlink: (service: string, app: string) =>
      write(`mongo:unlink ${service} ${app}`),
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
    restart: (app: string) => write(`ps:restart ${app}`),
    start: (app: string) => write(`ps:start ${app}`),
    stop: (app: string) => write(`ps:stop ${app}`),
  },
  storage: {
    ensure: (path: string) => write(`storage:ensure-directory ${path}`),
    list: (app: string) => read(`storage:list ${app}`),
    mount: (app: string, hostPath: string, containerPath: string) =>
      write(`storage:mount ${app} ${hostPath}:${containerPath}`),
    unmount: (app: string, hostPath: string, containerPath: string) =>
      write(`storage:unmount ${app} ${hostPath}:${containerPath}`),
  },
  version: () => read("version", false),
}

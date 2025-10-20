import { parse } from "dotenv"

// Environment variable key must start with a letter or underscore,
// followed by letters, numbers, or underscores (all uppercase)
export const ENV_KEY_PATTERN = /^[A-Z_][A-Z0-9_]*$/

function isSystemKey(key: string): boolean {
  return (
    key.startsWith("DOKKU_") ||
    key.startsWith("GIT_") ||
    key === "NO_VHOST" ||
    key === "PORT"
  )
}

export function validateKey(
  key: string,
  operation: string,
  throwOnSystemKeys = true
): boolean {
  if (!ENV_KEY_PATTERN.test(key)) {
    throw new Error(
      `Invalid key format: ${key} (should be uppercase letters, numbers, and underscores only).`
    )
  }

  if (isSystemKey(key)) {
    if (!throwOnSystemKeys) {
      return false
    }

    throw new Error(
      `${key} is a special environment variable and cannot be ${operation}.`
    )
  }

  return true
}

export function parseEnvText(
  envText: string,
  throwOnSystemKeys: boolean
): Record<string, string> {
  const parsed = parse(envText) as Record<string, string>

  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(parsed)) {
    if (!validateKey(key, "set manually", throwOnSystemKeys)) {
      continue
    }

    env[key] = value
  }

  return env
}

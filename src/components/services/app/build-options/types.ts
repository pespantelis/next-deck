export const BUILD_OPTIONS = {
  noCache: "--no-cache",
  githubTokenSecret:
    "--secret id=github_token,src=/home/dokku/.secrets/github_token",
} as const

export type BuildOptionKey = keyof typeof BUILD_OPTIONS

export interface Data {
  noCache: boolean
  githubTokenSecret: boolean
}

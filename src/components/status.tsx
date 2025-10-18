import { MinusIcon, PlayIcon, SquareIcon } from "lucide-react"

export function StatusIcon({
  running,
  deployed,
}: {
  running: boolean
  deployed: boolean
}) {
  if (running) {
    return <PlayIcon className="text-green-500/80" aria-label="Running" />
  }
  if (deployed) {
    return <SquareIcon className="text-red-500/80" aria-label="Stopped" />
  }
  return <MinusIcon aria-label="Not deployed yet" />
}

export function StatusText({
  running,
  deployed,
}: {
  running: boolean
  deployed: boolean
}) {
  if (running) {
    return "Running"
  }
  if (deployed) {
    return "Stopped"
  }
  return "Not deployed yet"
}

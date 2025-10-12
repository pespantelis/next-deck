interface ServiceLayoutProps {
  environment: React.ReactNode
  domains: React.ReactNode
  volumes: React.ReactNode
}

export default function ServiceLayout({
  environment,
  domains,
  volumes,
}: ServiceLayoutProps) {
  return (
    <div className="grid gap-4 p-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">{environment}</div>
      <div className="flex flex-col gap-4">
        {domains}
        {volumes}
      </div>
    </div>
  )
}

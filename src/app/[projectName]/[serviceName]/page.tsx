import { getService } from "./actions"

interface ServicePageProps {
  params: {
    projectName: string
    serviceName: string
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceName } = await params
  const service = await getService(serviceName)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">{service.name}</h1>
      </div>
    </div>
  )
}

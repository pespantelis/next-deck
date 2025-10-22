export interface Project {
  name: string
  services: Service[]
}

export type ServiceType = "app" | "postgres"

export interface Service {
  type: ServiceType
  name: string
  running: boolean
  deployed: boolean
}

export type ServiceCreatedCallback = (serviceName: string) => void

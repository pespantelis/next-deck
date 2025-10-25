export interface Project {
  name: string
  services: Service[]
}

export type ServiceType = "app" | "postgres" | "mongo"
export type DatabaseType = "postgres" | "mongo"

export interface Service {
  type: ServiceType
  name: string
  running: boolean
  deployed: boolean
}

export interface ServiceIdentifier {
  projectName: string
  serviceName: string
}

export type ServiceCreatedCallback = (serviceName: string) => void

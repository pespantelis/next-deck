export interface Project {
  name: string
  services: Service[]
}

export interface Service {
  name: string
  running: boolean
  deployed: boolean
}

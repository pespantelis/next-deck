import { getProjects } from "./actions"
import { ProjectSidebar } from "./sidebar"

export async function DeckSidebar() {
  const projects = await getProjects()

  return <ProjectSidebar initialProjects={projects} />
}

interface ProjectPageProps {
  params: Promise<{
    projectName: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectName } = await params

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize">{projectName}</h1>
      <p className="mt-2 text-muted-foreground">Project management page</p>
    </div>
  )
}

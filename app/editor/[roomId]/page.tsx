import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace/workspace-shell"
import { getCurrentIdentity, getProjectForIdentity } from "@/lib/project-access"

export default async function WorkspacePage(
  props: PageProps<"/editor/[roomId]">
) {
  const { roomId } = await props.params

  const identity = await getCurrentIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  const project = await getProjectForIdentity(roomId, identity)

  if (!project) {
    return <AccessDenied />
  }

  return (
    <WorkspaceShell
      project={project}
      isOwner={project.ownerId === identity.userId}
    />
  )
}

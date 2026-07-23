import { auth, currentUser } from "@clerk/nextjs/server"

import { EditorChrome } from "@/components/editor/editor-chrome"
import { prisma } from "@/lib/prisma"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null
  const email = user?.primaryEmailAddress?.emailAddress

  const [ownedProjects, sharedProjects] = await Promise.all([
    userId
      ? prisma.project.findMany({
          where: { ownerId: userId },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    email
      ? prisma.project.findMany({
          where: { collaborators: { some: { email } } },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ])

  return (
    <EditorChrome ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
      {children}
    </EditorChrome>
  )
}

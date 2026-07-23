import { auth, currentUser } from "@clerk/nextjs/server"
import { cookies } from "next/headers"

import { EditorChrome } from "@/components/editor/editor-chrome"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/lib/projects"

const SIDEBAR_OPEN_COOKIE = "sidebar-open"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const initialSidebarOpen = cookieStore.get(SIDEBAR_OPEN_COOKIE)?.value === "1"

  // Deliberately not awaited: awaiting these here would block the entire
  // layout (and everything nested under it, including `children`) on two
  // uncached Prisma round-trips before any HTML can stream to the client.
  // Passing the promises through lets `ProjectSidebarLoader` suspend on just
  // the sidebar while the requested route renders immediately. See
  // node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md:
  // "If the layout accesses uncached or runtime data... loading.js will not
  // show a fallback for it. Navigation blocks until the layout finishes
  // rendering" unless the fetch is moved out of the layout body itself.
  const ownedProjectsPromise: Promise<Project[]> = userId
    ? prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
      })
    : Promise.resolve([])

  const sharedProjectsPromise: Promise<Project[]> = (async () => {
    if (!userId) return []
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) return []
    return prisma.project.findMany({
      where: { collaborators: { some: { email } } },
      orderBy: { createdAt: "desc" },
    })
  })()

  return (
    <EditorChrome
      initialSidebarOpen={initialSidebarOpen}
      ownedProjectsPromise={ownedProjectsPromise}
      sharedProjectsPromise={sharedProjectsPromise}
    >
      {children}
    </EditorChrome>
  )
}

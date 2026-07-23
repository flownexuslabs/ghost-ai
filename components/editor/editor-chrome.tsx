"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectSidebarLoader } from "@/components/editor/project-sidebar-loader"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects"

const SIDEBAR_OPEN_COOKIE = "sidebar-open"

interface EditorChromeProps {
  children: React.ReactNode
  initialSidebarOpen: boolean
  ownedProjectsPromise: Promise<Project[]>
  sharedProjectsPromise: Promise<Project[]>
}

export function EditorChrome({
  children,
  initialSidebarOpen,
  ownedProjectsPromise,
  sharedProjectsPromise,
}: EditorChromeProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialSidebarOpen)

  function updateSidebarOpen(next: boolean) {
    setIsSidebarOpen(next)
    // Persisted so the sidebar's open/closed state survives a hard page
    // reload instead of always resetting to closed.
    document.cookie = `${SIDEBAR_OPEN_COOKIE}=${next ? "1" : "0"}; path=/; max-age=31536000`
  }

  function toggleSidebar() {
    const next = !isSidebarOpen
    updateSidebarOpen(next)
    // Owned/shared project lists are fetched once per layout render and
    // never invalidated when someone else (e.g. an owner sharing a
    // project) mutates them — refresh on every open so the sidebar
    // doesn't require a manual page reload to pick up new data.
    if (next) router.refresh()
  }

  return (
    <ProjectDialogsProvider>
      <div className="min-h-screen bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        <Suspense
          fallback={
            <ProjectSidebar
              isOpen={isSidebarOpen}
              onClose={() => updateSidebarOpen(false)}
              ownedProjects={[]}
              sharedProjects={[]}
              isLoading
            />
          }
        >
          <ProjectSidebarLoader
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            ownedProjectsPromise={ownedProjectsPromise}
            sharedProjectsPromise={sharedProjectsPromise}
          />
        </Suspense>
        <main
          className={cn(
            "pt-12 transition-[margin-left] duration-200 ease-out",
            isSidebarOpen && "lg:ml-72"
          )}
        >
          {children}
        </main>
      </div>
    </ProjectDialogsProvider>
  )
}

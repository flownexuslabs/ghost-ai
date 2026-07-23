"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import type { Project } from "@/lib/projects"

interface EditorChromeProps {
  children: React.ReactNode
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function EditorChrome({
  children,
  ownedProjects,
  sharedProjects,
}: EditorChromeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ProjectDialogsProvider
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <div className="min-h-screen bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="pt-12">{children}</main>
      </div>
    </ProjectDialogsProvider>
  )
}

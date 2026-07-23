"use client"

import { use } from "react"

import { ProjectSidebar } from "@/components/editor/project-sidebar"
import type { Project } from "@/lib/projects"

interface ProjectSidebarLoaderProps {
  isOpen: boolean
  onClose: () => void
  ownedProjectsPromise: Promise<Project[]>
  sharedProjectsPromise: Promise<Project[]>
}

export function ProjectSidebarLoader({
  isOpen,
  onClose,
  ownedProjectsPromise,
  sharedProjectsPromise,
}: ProjectSidebarLoaderProps) {
  const ownedProjects = use(ownedProjectsPromise)
  const sharedProjects = use(sharedProjectsPromise)

  return (
    <ProjectSidebar
      isOpen={isOpen}
      onClose={onClose}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}

"use client"

import { useState } from "react"

import { mockProjects, slugify, type Project } from "@/lib/projects"

type ProjectDialogType = "create" | "rename" | "delete" | null

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [dialogType, setDialogType] = useState<ProjectDialogType>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = slugify(name)

  function openCreateDialog() {
    setName("")
    setActiveProject(null)
    setDialogType("create")
  }

  function openRenameDialog(project: Project) {
    setName(project.name)
    setActiveProject(project)
    setDialogType("rename")
  }

  function openDeleteDialog(project: Project) {
    setActiveProject(project)
    setDialogType("delete")
  }

  function closeDialog() {
    setDialogType(null)
    setActiveProject(null)
    setName("")
  }

  async function submitCreate() {
    if (!name.trim()) return
    setIsLoading(true)
    await wait(400)
    setProjects((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), slug, role: "owner" },
    ])
    setIsLoading(false)
    closeDialog()
  }

  async function submitRename() {
    if (!activeProject || !name.trim()) return
    setIsLoading(true)
    await wait(400)
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProject.id
          ? { ...project, name: name.trim(), slug: slugify(name) }
          : project
      )
    )
    setIsLoading(false)
    closeDialog()
  }

  async function submitDelete() {
    if (!activeProject) return
    setIsLoading(true)
    await wait(400)
    setProjects((prev) =>
      prev.filter((project) => project.id !== activeProject.id)
    )
    setIsLoading(false)
    closeDialog()
  }

  return {
    projects,
    dialogType,
    activeProject,
    name,
    slug,
    isLoading,
    setName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}

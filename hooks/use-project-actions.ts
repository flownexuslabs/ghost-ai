"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { generateRoomSuffix, slugify } from "@/lib/projects"
import type { Project } from "@/lib/projects"

type ProjectDialogType = "create" | "rename" | "delete" | null

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()

  const [dialogType, setDialogType] = useState<ProjectDialogType>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = slugify(name)
  const roomId = slug ? `${slug}-${suffix}` : ""

  function openCreateDialog() {
    setName("")
    setActiveProject(null)
    setSuffix(generateRoomSuffix())
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
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, name: name.trim() }),
      })
      if (!response.ok) return

      const project: Project = await response.json()
      closeDialog()
      router.push(`/editor/${project.id}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRename() {
    if (!activeProject || !name.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!response.ok) return

      closeDialog()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDelete() {
    if (!activeProject) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      })
      if (!response.ok) return

      const wasActiveWorkspace = pathname === `/editor/${activeProject.id}`
      closeDialog()

      if (wasActiveWorkspace) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialogType,
    activeProject,
    name,
    roomId,
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

"use client"

import { Plus } from "lucide-react"

import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import { Button } from "@/components/ui/button"

export function EditorHome() {
  const { openCreateDialog } = useProjectDialogsContext()

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <h1 className="text-lg font-medium text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="max-w-sm text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the
        sidebar.
      </p>
      <Button onClick={openCreateDialog} className="mt-2">
        <Plus />
        New Project
      </Button>
    </div>
  )
}

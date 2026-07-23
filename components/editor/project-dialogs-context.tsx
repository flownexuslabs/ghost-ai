"use client"

import { createContext, useContext } from "react"

import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog"
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/lib/projects"

interface ProjectDialogsContextValue {
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
}

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(
  null
)

interface ProjectDialogsProviderProps {
  children: React.ReactNode
}

export function ProjectDialogsProvider({
  children,
}: ProjectDialogsProviderProps) {
  const {
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
  } = useProjectActions()

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreateDialog,
        openRenameDialog,
        openDeleteDialog,
      }}
    >
      {children}
      <CreateProjectDialog
        open={dialogType === "create"}
        onOpenChange={(open) => {
          if (!open && !isLoading) closeDialog()
        }}
        name={name}
        roomId={roomId}
        isLoading={isLoading}
        onNameChange={setName}
        onSubmit={submitCreate}
      />
      <RenameProjectDialog
        open={dialogType === "rename"}
        onOpenChange={(open) => {
          if (!open && !isLoading) closeDialog()
        }}
        project={activeProject}
        name={name}
        isLoading={isLoading}
        onNameChange={setName}
        onSubmit={submitRename}
      />
      <DeleteProjectDialog
        open={dialogType === "delete"}
        onOpenChange={(open) => {
          if (!open && !isLoading) closeDialog()
        }}
        project={activeProject}
        isLoading={isLoading}
        onConfirm={submitDelete}
      />
    </ProjectDialogsContext.Provider>
  )
}

export function useProjectDialogsContext() {
  const context = useContext(ProjectDialogsContext)
  if (!context) {
    throw new Error(
      "useProjectDialogsContext must be used within ProjectDialogsProvider"
    )
  }
  return context
}

"use client"

import { MoreVertical, Pencil, Plus, Trash2, X } from "lucide-react"

import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { projects, openCreateDialog, openRenameDialog, openDeleteDialog } =
    useProjectDialogsContext()

  const ownedProjects = projects.filter((project) => project.role === "owner")
  const sharedProjects = projects.filter(
    (project) => project.role === "collaborator"
  )

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-200 ease-out lg:hidden",
          isOpen && "opacity-100 pointer-events-auto"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-12 bottom-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-surface-border bg-surface shadow-xl transition-transform duration-200 ease-out",
          isOpen && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X />
          </Button>
        </div>

        <Tabs
          defaultValue="mine"
          className="flex flex-1 flex-col overflow-hidden px-4 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="mine" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="mine"
            className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-2"
          >
            {ownedProjects.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-copy-muted">No projects yet</p>
              </div>
            ) : (
              ownedProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  onRename={() => openRenameDialog(project)}
                  onDelete={() => openDeleteDialog(project)}
                />
              ))
            )}
          </TabsContent>
          <TabsContent
            value="shared"
            className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-2"
          >
            {sharedProjects.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-copy-muted">No shared projects yet</p>
              </div>
            ) : (
              sharedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center rounded-lg px-2 py-1.5"
                >
                  <span className="truncate text-sm text-copy-primary">
                    {project.name}
                  </span>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full" onClick={openCreateDialog}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

function ProjectRow({
  project,
  onRename,
  onDelete,
}: {
  project: Project
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <div className="group flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-elevated">
      <span className="truncate text-sm text-copy-primary">
        {project.name}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 max-lg:opacity-100"
              aria-label={`${project.name} actions`}
            />
          }
        >
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onRename}>
            <Pencil />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

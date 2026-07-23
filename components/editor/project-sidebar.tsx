"use client"

import { MoreVertical, Pencil, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  ownedProjects: Project[]
  sharedProjects: Project[]
  isLoading?: boolean
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  isLoading,
}: ProjectSidebarProps) {
  const { openCreateDialog, openRenameDialog, openDeleteDialog } =
    useProjectDialogsContext()

  const pathname = usePathname()
  const currentRoomId = pathname.startsWith("/editor/")
    ? pathname.slice("/editor/".length).split("/")[0]
    : undefined

  const defaultTab = sharedProjects.some(
    (project) => project.id === currentRoomId
  )
    ? "shared"
    : "mine"

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
          defaultValue={defaultTab}
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
                <p className="text-sm text-copy-muted">
                  {isLoading ? "Loading projects…" : "No projects yet"}
                </p>
              </div>
            ) : (
              ownedProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isActive={project.id === currentRoomId}
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
                <p className="text-sm text-copy-muted">
                  {isLoading ? "Loading projects…" : "No shared projects yet"}
                </p>
              </div>
            ) : (
              sharedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/editor/${project.id}`}
                  className={cn(
                    "flex items-center rounded-lg px-2 py-1.5 hover:bg-elevated",
                    project.id === currentRoomId
                      ? "bg-accent-dim text-brand"
                      : "text-copy-primary"
                  )}
                >
                  <span className="truncate text-sm">{project.name}</span>
                </Link>
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
  isActive,
  onRename,
  onDelete,
}: {
  project: Project
  isActive?: boolean
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-lg hover:bg-elevated",
        isActive && "bg-accent-dim"
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className={cn(
          "flex-1 truncate px-2 py-1.5 text-sm",
          isActive ? "font-medium text-brand" : "text-copy-primary"
        )}
      >
        {project.name}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="mr-1 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 max-lg:opacity-100"
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

"use client"

import { useState } from "react"
import { PanelRightClose, PanelRightOpen, Share2 } from "lucide-react"

import { ShareDialog } from "@/components/editor/dialogs/share-dialog"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/projects"

interface WorkspaceShellProps {
  project: Project
  isOwner: boolean
}

export function WorkspaceShell({ project, isOwner }: WorkspaceShellProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="flex h-12 shrink-0 items-center border-b border-surface-border bg-surface px-4">
        <div className="flex flex-1 items-center justify-start" />
        <div className="flex flex-1 items-center justify-center">
          <span className="truncate text-sm font-medium text-copy-primary">
            {project.name}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsAiSidebarOpen((open) => !open)}
            aria-label={
              isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
            }
          >
            {isAiSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 items-center justify-center bg-base">
          <p className="text-sm text-copy-muted">Canvas coming soon</p>
        </div>

        {isAiSidebarOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-surface-border bg-surface">
            <div className="border-b border-surface-border px-4 py-3">
              <h2 className="text-sm font-medium text-copy-primary">
                AI Chat
              </h2>
            </div>
            <div className="flex flex-1 items-center justify-center px-4">
              <p className="text-center text-sm text-copy-muted">
                AI chat coming soon
              </p>
            </div>
          </aside>
        )}
      </div>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        projectId={project.id}
        projectName={project.name}
        isOwner={isOwner}
      />
    </div>
  )
}

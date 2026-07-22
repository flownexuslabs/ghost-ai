"use client"

import { useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Project } from "@/lib/projects"

interface RenameProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  name: string
  isLoading: boolean
  onNameChange: (name: string) => void
  onSubmit: () => void
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  project,
  name,
  isLoading,
  onNameChange,
  onSubmit,
}: RenameProjectDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent initialFocus={inputRef}>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Choose a new name for {project?.name ?? "this project"}.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-1.5"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <Input
            ref={inputRef}
            value={name}
            placeholder="Project name"
            onChange={(event) => onNameChange(event.target.value)}
          />
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Renaming..." : "Rename project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

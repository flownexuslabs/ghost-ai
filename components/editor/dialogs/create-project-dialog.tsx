"use client"

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

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  roomId: string
  isLoading: boolean
  onNameChange: (name: string) => void
  onSubmit: () => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  roomId,
  isLoading,
  onNameChange,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Name your architecture workspace. You can rename it later.
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
            autoFocus
            aria-label="Project name"
            value={name}
            placeholder="Project name"
            onChange={(event) => onNameChange(event.target.value)}
          />
          <p className="px-0.5 text-xs text-copy-muted">
            {roomId ? `/${roomId}` : "Enter a name to see the project URL"}
          </p>
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

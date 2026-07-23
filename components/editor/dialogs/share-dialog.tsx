"use client"

import { useState } from "react"
import { Check, Copy, Trash2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCollaborators } from "@/hooks/use-collaborators"
import type { CollaboratorSummary } from "@/lib/collaborators"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectName: string
  isOwner: boolean
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  isOwner,
}: ShareDialogProps) {
  const { collaborators, isLoading, isInviting, error, invite, remove } =
    useCollaborators({ projectId, enabled: open })
  const [email, setEmail] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  async function handleInvite() {
    const trimmed = email.trim()
    if (!trimmed) return
    await invite(trimmed)
    setEmail("")
  }

  async function handleCopyLink() {
    const link = `${window.location.origin}/editor/${projectId}`
    await navigator.clipboard.writeText(link)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share &quot;{projectName}&quot;</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators by email and manage who has access."
              : "People with access to this project."}
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          variant="outline"
          className="justify-start"
          onClick={handleCopyLink}
        >
          {isCopied ? <Check /> : <Copy />}
          {isCopied ? "Copied!" : "Copy project link"}
        </Button>

        {isOwner && (
          <form
            className="flex flex-col gap-1.5"
            onSubmit={(event) => {
              event.preventDefault()
              handleInvite()
            }}
          >
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button type="submit" disabled={!email.trim() || isInviting}>
                <UserPlus />
                {isInviting ? "Inviting..." : "Invite"}
              </Button>
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
          </form>
        )}

        <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-copy-muted">
              Loading collaborators…
            </p>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-copy-muted">
              No collaborators yet
            </p>
          ) : (
            collaborators.map((collaborator) => (
              <CollaboratorRow
                key={collaborator.id}
                collaborator={collaborator}
                canRemove={isOwner}
                onRemove={() => remove(collaborator.id)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CollaboratorRow({
  collaborator,
  canRemove,
  onRemove,
}: {
  collaborator: CollaboratorSummary
  canRemove: boolean
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
      <CollaboratorAvatar collaborator={collaborator} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-copy-primary">
          {collaborator.name ?? collaborator.email}
        </p>
        {collaborator.name && (
          <p className="truncate text-xs text-copy-muted">
            {collaborator.email}
          </p>
        )}
      </div>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${collaborator.email}`}
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      )}
    </div>
  )
}

function CollaboratorAvatar({
  collaborator,
}: {
  collaborator: CollaboratorSummary
}) {
  if (collaborator.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={collaborator.imageUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    )
  }

  const initial =
    (collaborator.name ?? collaborator.email)[0]?.toUpperCase() ?? "?"

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-medium text-copy-secondary">
      {initial}
    </div>
  )
}

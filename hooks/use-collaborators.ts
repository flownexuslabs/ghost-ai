"use client"

import { useCallback, useEffect, useState } from "react"

import type { CollaboratorSummary } from "@/lib/collaborators"

interface UseCollaboratorsOptions {
  projectId: string
  enabled: boolean
}

export function useCollaborators({ projectId, enabled }: UseCollaboratorsOptions) {
  const [collaborators, setCollaborators] = useState<
    CollaboratorSummary[] | null
  >(null)
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCollaborators = useCallback(async () => {
    const response = await fetch(`/api/projects/${projectId}/collaborators`)
    if (!response.ok) return null
    return (await response.json()) as CollaboratorSummary[]
  }, [projectId])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    fetchCollaborators().then((data) => {
      if (!cancelled && data) setCollaborators(data)
    })

    return () => {
      cancelled = true
    }
  }, [enabled, fetchCollaborators])

  const invite = useCallback(
    async (email: string) => {
      setIsInviting(true)
      setError(null)
      try {
        const response = await fetch(`/api/projects/${projectId}/collaborators`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          setError(
            typeof body?.error === "string"
              ? body.error
              : "Failed to invite collaborator"
          )
          return
        }

        setCollaborators(await fetchCollaborators())
      } finally {
        setIsInviting(false)
      }
    },
    [projectId, fetchCollaborators]
  )

  const remove = useCallback(
    async (collaboratorId: string) => {
      const previous = collaborators
      setCollaborators(
        (current) =>
          current?.filter((collaborator) => collaborator.id !== collaboratorId) ??
          current
      )

      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        setCollaborators(previous)
      }
    },
    [collaborators, projectId]
  )

  return {
    collaborators: collaborators ?? [],
    isLoading: enabled && collaborators === null,
    isInviting,
    error,
    invite,
    remove,
  }
}

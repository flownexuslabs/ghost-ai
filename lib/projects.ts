import type { Project } from "@/app/generated/prisma/client"

export type { Project }

export function slugify(value: string): string {
  const trimmed = value.trim()
  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (slug || !trimmed) {
    return slug
  }

  return "project"
}

export const ROOM_ID_MAX_LENGTH = 80

export function generateRoomSuffix(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10)
}

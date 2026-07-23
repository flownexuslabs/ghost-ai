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

export function generateRoomSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

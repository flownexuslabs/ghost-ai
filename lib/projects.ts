export type ProjectRole = "owner" | "collaborator"

export interface Project {
  id: string
  name: string
  slug: string
  role: ProjectRole
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Checkout Redesign",
    slug: "checkout-redesign",
    role: "owner",
  },
  {
    id: "2",
    name: "Notification Service",
    slug: "notification-service",
    role: "owner",
  },
  {
    id: "3",
    name: "Payments Platform",
    slug: "payments-platform",
    role: "collaborator",
  },
]

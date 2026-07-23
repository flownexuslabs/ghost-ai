export interface CollaboratorSummary {
  id: string
  email: string
  name: string | null
  imageUrl: string | null
  createdAt: string
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

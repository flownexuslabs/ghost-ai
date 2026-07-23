import { clerkClient } from "@clerk/nextjs/server"

export interface EnrichedClerkUser {
  name: string | null
  imageUrl: string | null
}

const CLERK_EMAIL_BATCH_SIZE = 100

export async function getClerkUsersByEmail(
  emails: string[]
): Promise<Map<string, EnrichedClerkUser>> {
  const enrichedByEmail = new Map<string, EnrichedClerkUser>()

  if (emails.length === 0) {
    return enrichedByEmail
  }

  try {
    const client = await clerkClient()

    for (let i = 0; i < emails.length; i += CLERK_EMAIL_BATCH_SIZE) {
      const batch = emails.slice(i, i + CLERK_EMAIL_BATCH_SIZE)
      const { data: users } = await client.users.getUserList({
        emailAddress: batch,
        limit: batch.length,
      })

      for (const user of users) {
        const name = [user.firstName, user.lastName].filter(Boolean).join(" ")
        const enriched: EnrichedClerkUser = {
          name: name || null,
          imageUrl: user.imageUrl || null,
        }

        for (const address of user.emailAddresses) {
          if (batch.includes(address.emailAddress)) {
            enrichedByEmail.set(address.emailAddress, enriched)
          }
        }
      }
    }
  } catch {
    // Enrichment is best-effort — a Clerk API failure shouldn't block
    // listing/inviting collaborators, just fall back to email-only display
    // for whatever wasn't already resolved in an earlier batch.
    return enrichedByEmail
  }

  return enrichedByEmail
}

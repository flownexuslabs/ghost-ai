import { clerkClient } from "@clerk/nextjs/server"

export interface EnrichedClerkUser {
  name: string | null
  imageUrl: string | null
}

export async function getClerkUsersByEmail(
  emails: string[]
): Promise<Map<string, EnrichedClerkUser>> {
  const enrichedByEmail = new Map<string, EnrichedClerkUser>()

  if (emails.length === 0) {
    return enrichedByEmail
  }

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    emailAddress: emails,
  })

  for (const user of users) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ")
    const enriched: EnrichedClerkUser = {
      name: name || null,
      imageUrl: user.imageUrl || null,
    }

    for (const address of user.emailAddresses) {
      if (emails.includes(address.emailAddress)) {
        enrichedByEmail.set(address.emailAddress, enriched)
      }
    }
  }

  return enrichedByEmail
}

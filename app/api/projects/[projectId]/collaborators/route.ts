import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { Prisma } from "@/app/generated/prisma/client"
import { getClerkUsersByEmail } from "@/lib/clerk-users"
import { EMAIL_PATTERN } from "@/lib/collaborators"
import { getCurrentIdentity, getProjectForIdentity } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">
) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await ctx.params
  const project = await getProjectForIdentity(projectId, identity)

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  })

  const enrichedByEmail = await getClerkUsersByEmail(
    collaborators.map((collaborator) => collaborator.email)
  )

  return NextResponse.json(
    collaborators.map((collaborator) => {
      const enriched = enrichedByEmail.get(collaborator.email)
      return {
        id: collaborator.id,
        email: collaborator.email,
        name: enriched?.name ?? null,
        imageUrl: enriched?.imageUrl ?? null,
        createdAt: collaborator.createdAt,
      }
    })
  )
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await ctx.params
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })

  if (existing) {
    return NextResponse.json(
      { error: "Already a collaborator" },
      { status: 409 }
    )
  }

  let collaborator
  try {
    collaborator = await prisma.projectCollaborator.create({
      data: { projectId, email },
    })
  } catch (error) {
    // The findUnique check above narrows the common case, but a concurrent
    // invite for the same email can still race past it — the unique
    // constraint on [projectId, email] is the actual source of truth.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Already a collaborator" },
        { status: 409 }
      )
    }
    throw error
  }

  const enrichedByEmail = await getClerkUsersByEmail([email])
  const enriched = enrichedByEmail.get(email)

  return NextResponse.json(
    {
      id: collaborator.id,
      email: collaborator.email,
      name: enriched?.name ?? null,
      imageUrl: enriched?.imageUrl ?? null,
      createdAt: collaborator.createdAt,
    },
    { status: 201 }
  )
}

import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const name =
    typeof body?.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : "Untitled Project"

  // An optional client-supplied id doubles as the Liveblocks room id, so the
  // project id and the collaborative room id stay the same string end to end.
  const id =
    typeof body?.id === "string" && /^[a-z0-9-]{1,80}$/.test(body.id)
      ? body.id
      : undefined

  const project = await prisma.project.create({
    data: { id, ownerId: userId, name },
  })

  return NextResponse.json(project, { status: 201 })
}

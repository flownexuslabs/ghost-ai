import { Lock } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-elevated">
        <Lock className="size-5 text-copy-muted" />
      </div>
      <h1 className="text-lg font-medium text-copy-primary">
        You don&apos;t have access to this project
      </h1>
      <p className="max-w-sm text-sm text-copy-muted">
        This project doesn&apos;t exist or you haven&apos;t been added as a
        collaborator.
      </p>
      <Button
        render={<Link href="/editor" />}
        nativeButton={false}
        className="mt-2"
      >
        Back to editor
      </Button>
    </div>
  )
}

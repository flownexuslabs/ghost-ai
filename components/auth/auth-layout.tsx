import { Ghost } from "lucide-react"

const FEATURES = [
  "Write, edit, and organize chapters in one place",
  "AI-assisted drafting that keeps your voice",
  "Version history so nothing is ever lost",
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden w-1/2 flex-col justify-center gap-8 border-r border-surface-border bg-surface px-16 lg:flex">
        <div className="flex items-center gap-2">
          <Ghost className="size-6 text-brand" />
          <span className="text-lg font-semibold text-copy-primary">
            Ghost AI
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-medium text-copy-primary">
            Your writing, ghostwritten by you.
          </p>
          <ul className="flex flex-col gap-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="text-sm text-copy-secondary">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center px-6 max-lg:w-full">
        {children}
      </div>
    </div>
  )
}

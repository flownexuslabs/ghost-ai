import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

const css = readFileSync(path.join(__dirname, "globals.css"), "utf-8")

describe("globals.css", () => {
  it("does not register --color-base as a Tailwind theme token", () => {
    // Regression guard: --color-base was intentionally removed from the
    // @theme inline block because Tailwind auto-derives text-/border-/ring-
    // color utilities from every --color- key, and "base" collided with
    // Tailwind's own text-base font-size utility.
    expect(css).not.toMatch(/--color-base:\s*var\(--bg-base\)/)
  })

  it("still defines the --bg-base custom property for the standalone utility to consume", () => {
    expect(css).toMatch(/--bg-base:\s*#080809;/)
  })

  it("defines a standalone bg-base utility backed by --bg-base", () => {
    expect(css).toMatch(/@utility bg-base\s*\{/)
    const utilityBlockMatch = css.match(/@utility bg-base\s*\{([^}]*)\}/)
    expect(utilityBlockMatch).not.toBeNull()
    expect(utilityBlockMatch?.[1]).toMatch(
      /background-color:\s*var\(--bg-base\);/
    )
  })

  it("sets color-scheme: dark on the :root/.dark palette block", () => {
    expect(css).toMatch(/color-scheme:\s*dark;/)
  })

  it("still registers the other semantic color tokens in the @theme block", () => {
    expect(css).toMatch(/--color-surface:\s*var\(--bg-surface\)/)
    expect(css).toMatch(/--color-elevated:\s*var\(--bg-elevated\)/)
    expect(css).toMatch(/--color-copy-primary:\s*var\(--text-primary\)/)
  })
})
import { describe, expect, it } from "vitest"

import { slugify } from "@/lib/projects"

describe("slugify", () => {
  it("slugifies an ordinary name", () => {
    expect(slugify("Checkout Redesign")).toBe("checkout-redesign")
  })

  it("collapses punctuation and repeated separators", () => {
    expect(slugify("  My Cool--Project!! ")).toBe("my-cool-project")
  })

  it("returns an empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("")
  })

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("")
  })

  it("falls back to 'project' for symbol-only input", () => {
    expect(slugify("!!!")).toBe("project")
  })

  it("falls back to 'project' for emoji-only input", () => {
    expect(slugify("😀😀😀")).toBe("project")
  })

  it("falls back to 'project' for non-Latin-only input", () => {
    expect(slugify("日本語")).toBe("project")
  })

  it("is deterministic for the same non-Latin input", () => {
    expect(slugify("日本語")).toBe(slugify("日本語"))
  })
})

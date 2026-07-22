import { describe, expect, it } from "vitest"

import { mockProjects, slugify, type Project } from "@/lib/projects"

describe("slugify", () => {
  it("lowercases the input", () => {
    expect(slugify("Checkout Redesign")).toBe("checkout-redesign")
  })

  it("trims leading and trailing whitespace before slugifying", () => {
    expect(slugify("  Payments Platform  ")).toBe("payments-platform")
  })

  it("replaces runs of non-alphanumeric characters with a single hyphen", () => {
    expect(slugify("Notification   Service!!")).toBe("notification-service")
  })

  it("collapses multiple consecutive separators into one hyphen", () => {
    expect(slugify("foo---bar___baz")).toBe("foo-bar-baz")
  })

  it("strips leading and trailing hyphens produced by punctuation", () => {
    expect(slugify("--Hello World--")).toBe("hello-world")
  })

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("")
  })

  it("returns an empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("")
  })

  it("returns an empty string when input has no alphanumeric characters", () => {
    expect(slugify("!!!___***")).toBe("")
  })

  it("preserves numbers", () => {
    expect(slugify("Project 123")).toBe("project-123")
  })

  it("strips characters outside a-z0-9 (e.g. accented letters)", () => {
    expect(slugify("Café")).toBe("caf")
  })

  it("leaves an already-valid slug unchanged", () => {
    expect(slugify("already-a-slug")).toBe("already-a-slug")
  })
})

describe("mockProjects", () => {
  it("contains exactly three seed projects", () => {
    expect(mockProjects).toHaveLength(3)
  })

  it("has two owner projects and one collaborator project", () => {
    const owners = mockProjects.filter((p) => p.role === "owner")
    const collaborators = mockProjects.filter((p) => p.role === "collaborator")
    expect(owners).toHaveLength(2)
    expect(collaborators).toHaveLength(1)
  })

  it("has unique ids", () => {
    const ids = mockProjects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("every project has a slug that matches slugify(name)", () => {
    mockProjects.forEach((project: Project) => {
      expect(project.slug).toBe(slugify(project.name))
    })
  })

  it("every project has the required shape", () => {
    mockProjects.forEach((project) => {
      expect(project).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        slug: expect.any(String),
        role: expect.stringMatching(/^(owner|collaborator)$/),
      })
    })
  })
})
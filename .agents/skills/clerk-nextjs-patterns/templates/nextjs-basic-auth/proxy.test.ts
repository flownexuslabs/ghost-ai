import { beforeEach, describe, expect, it, vi } from "vitest"

const clerkMiddlewareMock = vi.fn(
  (handler: (auth: unknown) => unknown) => handler
)

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: clerkMiddlewareMock,
}))

describe("nextjs-basic-auth proxy template", () => {
  beforeEach(() => {
    vi.resetModules()
    clerkMiddlewareMock.mockClear()
  })

  it("registers a middleware handler via clerkMiddleware", async () => {
    await import("./proxy")
    expect(clerkMiddlewareMock).toHaveBeenCalledTimes(1)
    expect(clerkMiddlewareMock.mock.calls[0][0]).toBeInstanceOf(Function)
  })

  it("calls auth.protect() for every request, unconditionally", async () => {
    const mod = await import("./proxy")
    const protectMock = vi.fn().mockResolvedValue(undefined)

    await mod.default({ protect: protectMock })

    expect(protectMock).toHaveBeenCalledTimes(1)
    expect(protectMock).toHaveBeenCalledWith()
  })

  it("awaits auth.protect() before resolving", async () => {
    const mod = await import("./proxy")
    let resolved = false
    const protectMock = vi.fn(
      () =>
        new Promise<void>((resolve) =>
          setTimeout(() => {
            resolved = true
            resolve()
          }, 0)
        )
    )

    await mod.default({ protect: protectMock })

    expect(resolved).toBe(true)
  })

  it("exports a matcher config with exactly two entries", async () => {
    const mod = await import("./proxy")
    expect(mod.config.matcher).toHaveLength(2)
    expect(mod.config.matcher[1]).toBe("/(api|trpc)(.*)")
  })

  it("excludes common static asset extensions from the first matcher", async () => {
    const mod = await import("./proxy")
    const staticAssetMatcher = mod.config.matcher[0]
    expect(staticAssetMatcher).toContain("_next")
    expect(staticAssetMatcher).toContain("css")
    expect(staticAssetMatcher).toContain("woff2?")
  })
})
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const clerkMiddlewareMock = vi.fn(
  (handler: (auth: unknown, req: unknown) => unknown) => handler
)
const createRouteMatcherMock = vi.fn((patterns: string[]) => {
  return (req: { nextUrl: { pathname: string } }) =>
    patterns.some((pattern) => new RegExp(`^${pattern}$`).test(req.nextUrl.pathname))
})

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: clerkMiddlewareMock,
  createRouteMatcher: createRouteMatcherMock,
}))

describe("proxy.ts", () => {
  beforeEach(() => {
    vi.resetModules()
    clerkMiddlewareMock.mockClear()
    createRouteMatcherMock.mockClear()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("falls back to /sign-in and /sign-up and warns when the env vars are unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "")
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "")
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    await import("@/proxy")

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain(
      "Falling back to /sign-in / /sign-up as public routes."
    )
    expect(createRouteMatcherMock).toHaveBeenCalledWith([
      "/sign-in(.*)",
      "/sign-up(.*)",
    ])

    warnSpy.mockRestore()
  })

  it("uses custom sign-in/up URLs from env vars and does not warn when both are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/custom-sign-in")
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "/custom-sign-up")
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    await import("@/proxy")

    expect(warnSpy).not.toHaveBeenCalled()
    expect(createRouteMatcherMock).toHaveBeenCalledWith([
      "/custom-sign-in(.*)",
      "/custom-sign-up(.*)",
    ])

    warnSpy.mockRestore()
  })

  it("warns when only one of the two env vars is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/custom-sign-in")
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "")
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    await import("@/proxy")

    expect(warnSpy).toHaveBeenCalledTimes(1)

    warnSpy.mockRestore()
  })

  it("skips auth.protect() for requests matching a public route", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/sign-in")
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "/sign-up")
    vi.spyOn(console, "warn").mockImplementation(() => {})

    const mod = await import("@/proxy")
    const protectMock = vi.fn().mockResolvedValue(undefined)

    await mod.default(
      { protect: protectMock },
      { nextUrl: { pathname: "/sign-in/factor-one" } }
    )

    expect(protectMock).not.toHaveBeenCalled()
  })

  it("calls auth.protect() for requests that are not public", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/sign-in")
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "/sign-up")
    vi.spyOn(console, "warn").mockImplementation(() => {})

    const mod = await import("@/proxy")
    const protectMock = vi.fn().mockResolvedValue(undefined)

    await mod.default(
      { protect: protectMock },
      { nextUrl: { pathname: "/editor" } }
    )

    expect(protectMock).toHaveBeenCalledTimes(1)
  })

  it("exports a matcher config that excludes static assets and includes api/trpc routes", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/sign-in")
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "/sign-up")
    vi.spyOn(console, "warn").mockImplementation(() => {})

    const mod = await import("@/proxy")

    expect(mod.config.matcher).toHaveLength(2)
    expect(mod.config.matcher[1]).toBe("/(api|trpc)(.*)")
    expect(mod.config.matcher[0]).toContain("_next")
  })
})
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up"

if (!process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || !process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL) {
  console.warn(
    "proxy.ts: NEXT_PUBLIC_CLERK_SIGN_IN_URL or NEXT_PUBLIC_CLERK_SIGN_UP_URL is not set. " +
      `Falling back to ${signInUrl} / ${signUpUrl} as public routes.`
  )
}

// API routes are exempted from middleware-level auth.protect(): that redirects
// (307 to sign-in) instead of returning 401 JSON. Each API route handler does
// its own auth() check and returns 401/403 explicitly instead.
const isPublicRoute = createRouteMatcher([`${signInUrl}(.*)`, `${signUpUrl}(.*)`, "/api(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}

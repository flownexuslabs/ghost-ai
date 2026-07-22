# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 3: Auth

## Current Goal

- Build out chapter-specific editor screens on top of the navbar/sidebar chrome (next unit after auth).

## Completed

- 01-design-system: shadcn/ui installed (Base UI style, base-nova), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, lucide-react installed, lib/utils.ts cn() helper created, globals.css wired to dark-only palette from context/ui-context.md (no light mode block, `dark` class always on `<html>`). Verified via `tsc --noEmit`, `next build`, and a rendered smoke route (removed after verification).
- 02-editor-chrome: `components/editor/editor-navbar.tsx` (fixed top navbar, left/center/right sections, sidebar toggle button switching `PanelLeftOpen`/`PanelLeftClose`, dark bg-surface with bottom border) and `components/editor/project-sidebar.tsx` (fixed floating overlay sliding in from left via translate transform, doesn't push content, `Projects` header + close button, `Tabs` with My Projects/Shared both showing empty placeholder text, full-width `New Project` button with `Plus` icon) built per context/feature-specs/02-editor-chrome.md. Dialog pattern requirement already satisfied by existing components/ui/dialog.tsx (title/description/footer, uses globals.css tokens via popover/muted mappings) — no new dialog built. Verified via `tsc --noEmit`, `eslint` (npm run lint), `next build`, and a Playwright smoke test against a temporary route (screenshots of closed/open sidebar states, no console errors; route and temp playwright install removed after verification).
- 03-auth: `@clerk/ui` installed for the `dark` base theme (`@clerk/ui/themes`). `app/layout.tsx` wraps the app in `ClerkProvider` with `appearance={{ theme: dark, variables: {...} }}`, all variable values pulled from the existing CSS custom properties in globals.css (no hardcoded colors). `proxy.ts` created at the project root (this Next.js version renamed `middleware.ts` to `proxy.ts` — confirmed via node_modules/next/dist/docs) using `clerkMiddleware` + `createRouteMatcher` from `@clerk/nextjs/server`; public routes are read from `NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`NEXT_PUBLIC_CLERK_SIGN_UP_URL` (added to `.env.local`, they didn't exist before), everything else calls `auth.protect()`. `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` render Clerk's `SignIn`/`SignUp` inside a shared `components/auth/auth-layout.tsx` (true 50/50 split on `lg:` via `w-1/2`/`w-1/2`, left panel on `bg-surface` to read as a distinct panel against the `bg-base` right side, form-only below `lg:`, no gradients/hero/feature cards per spec). `app/page.tsx` is now an async server component using `auth()` to redirect signed-in users to `/editor` and everyone else to `/sign-in`. `UserButton` added to the navbar's right section in `components/editor/editor-navbar.tsx`. Verified via `tsc --noEmit`, `eslint`, `next build` (proxy correctly registered as "Proxy (Middleware)" in build output, not middleware), curl checks that `/`, `/editor` redirect unauthenticated requests to `/sign-in` while `/sign-in` itself returns 200, and a temporary Playwright smoke test screenshotting sign-in/sign-up at desktop and mobile widths (no console errors; script and Playwright browser install removed after verification).

## In Progress

- None yet.

## Next Up

- Add the next planned feature unit here (next chapter spec after 03-auth).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- globals.css defines shadcn's standard tokens (background/foreground/primary/etc.) plus custom semantic tokens (bg-base, bg-surface, bg-elevated, bg-subtle, border-surface-border, border-surface-border-subtle, text-copy-primary/secondary/muted/faint, text-brand, bg-accent-dim, bg-ai/text-ai-text, bg-error/success/warning) per context/ui-context.md, both pointing at the same dark hex palette. `<html>` carries a permanent `dark` class since the app has no light mode.
- This repo's Next.js (16.2.11) and Clerk (`@clerk/nextjs` 7.5.22, `@clerk/ui` 1.25.6) are both ahead of general training data — confirmed against `node_modules/next/dist/docs` and the installed packages' own `.d.ts` files rather than assumed. Notably: `middleware.ts` is renamed to `proxy.ts` (same runtime behavior, `next.config` matcher unchanged); Clerk's appearance API uses `theme:` (not the older `baseTheme:`) inside `appearance={{ theme, variables }}`.
- Route protection uses `createRouteMatcher` + `auth.protect()` in `proxy.ts`, per the auth feature spec. Clerk's own SDK logs a deprecation warning for `createRouteMatcher` in favor of resource-based (per-page/action) auth checks — still functional, not removed, but worth revisiting if this Clerk version bumps further.
- Fixed a pre-existing bug in globals.css: `--font-sans` was defined as `var(--font-sans)` (circular, self-referencing), so the `font-sans` Tailwind utility never actually resolved to Geist Sans anywhere in the app — it silently fell back to the browser default font. Now maps to `var(--font-geist-sans)` (and added `--font-mono: var(--font-geist-mono)` alongside it). This affects all pages, not just auth. Clerk's `appearance.variables.fontFamily`/`fontFamilyMono` were also pinned to the same Geist variables since Clerk's portal-rendered UI doesn't reliably inherit body font otherwise.

## Session Notes

- Add context needed to resume work in the next session.

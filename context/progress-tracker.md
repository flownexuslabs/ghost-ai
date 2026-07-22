# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 2: Editor Chrome

## Current Goal

- Build out chapter-specific editor screens on top of the navbar/sidebar chrome.

## Completed

- 01-design-system: shadcn/ui installed (Base UI style, base-nova), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, lucide-react installed, lib/utils.ts cn() helper created, globals.css wired to dark-only palette from context/ui-context.md (no light mode block, `dark` class always on `<html>`). Verified via `tsc --noEmit`, `next build`, and a rendered smoke route (removed after verification).
- 02-editor-chrome: `components/editor/editor-navbar.tsx` (fixed top navbar, left/center/right sections, sidebar toggle button switching `PanelLeftOpen`/`PanelLeftClose`, dark bg-surface with bottom border) and `components/editor/project-sidebar.tsx` (fixed floating overlay sliding in from left via translate transform, doesn't push content, `Projects` header + close button, `Tabs` with My Projects/Shared both showing empty placeholder text, full-width `New Project` button with `Plus` icon) built per context/feature-specs/02-editor-chrome.md. Dialog pattern requirement already satisfied by existing components/ui/dialog.tsx (title/description/footer, uses globals.css tokens via popover/muted mappings) — no new dialog built. Verified via `tsc --noEmit`, `eslint` (npm run lint), `next build`, and a Playwright smoke test against a temporary route (screenshots of closed/open sidebar states, no console errors; route and temp playwright install removed after verification).

## In Progress

- None yet.

## Next Up

- Add the next planned feature unit here (next chapter spec after 02-editor-chrome).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- globals.css defines shadcn's standard tokens (background/foreground/primary/etc.) plus custom semantic tokens (bg-base, bg-surface, bg-elevated, bg-subtle, border-surface-border, border-surface-border-subtle, text-copy-primary/secondary/muted/faint, text-brand, bg-accent-dim, bg-ai/text-ai-text, bg-error/success/warning) per context/ui-context.md, both pointing at the same dark hex palette. `<html>` carries a permanent `dark` class since the app has no light mode.

## Session Notes

- Add context needed to resume work in the next session.

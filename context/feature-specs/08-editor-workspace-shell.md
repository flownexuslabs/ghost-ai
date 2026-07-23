Build the `/editor/[roomId]` workspace shell with server-side access checks. No canvas logic yet.

## Access

`/editor/[roomId]` must be a server component.

Before rendering:

- unauthenticated users redirect to `/sign-in`
- users without project access see `AccessDenied`
- non-existent projects also show `AccessDenied`

Create `components/editor/access-denied.tsx` with:

- centered layout
- lock icon
- short message
- link back to `/editor`

## Access Helpers

Create `lib/project-access.ts` with helpers for:

- getting current Clerk identity: `userId` + primary email
- checking project access by owner or collaborator

## Layout

Build a full-viewport workspace layout with:

- top navbar showing the project name
- navbar actions: share button and AI sidebar toggle
- existing `ProjectSidebar` on the left
- current room highlighted in the sidebar
- central canvas placeholder with dark background and centered message
- right sidebar placeholder for future AI chat

The canvas area should fill the remaining space.

## Scope

Do not add real canvas logic, Liveblocks, or AI chat yet. The share button is
wired to open `ShareDialog` (see `09-share-dialog.md`) — the sharing feature
itself is a separate spec, but its entry point from this shell is in scope
and implemented.

## Check When Done

- `/editor/[roomId]` builds successfully
- access helper exists outside the page component
- `AccessDenied` is used for missing or unauthorized projects
- workspace layout renders with current project context
- share button opens `ShareDialog`
- no TypeScript errors
